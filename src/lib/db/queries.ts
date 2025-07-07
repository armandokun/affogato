import { Message } from 'ai'

import { ChatVisibility } from '@/constants/chat'

import { ChatSDKError } from '../errors'
import { createClient } from '../supabase/server'
import { LanguageModelCode } from '../ai/providers'

export async function getChatById({ id }: { id: string }) {
  const supabase = await createClient()

  const { data, error } = await supabase.from('chats').select('*').eq('id', id).single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }

    throw new ChatSDKError('bad_request:database', 'Failed to get chat by id')
  }

  return data
}

export async function saveChat({
  id,
  title,
  visibility
}: {
  id: string
  title: string
  visibility: ChatVisibility
}) {
  const supabase = await createClient()

  try {
    return await supabase.from('chats').insert({
      id,
      title,
      visibility
    })
  } catch {
    throw new ChatSDKError('bad_request:database', 'Failed to save chat')
  }
}

export async function updateChatTitle({ id, title }: { id: string; title: string }) {
  const supabase = await createClient()

  const { data, error } = await supabase.from('chats').update({ title }).eq('id', id)

  if (error) throw new ChatSDKError('bad_request:database', 'Failed to update chat title')

  return data
}

export async function saveMessage({
  chatId,
  message
}: {
  chatId: string
  message: Message & { model_code: LanguageModelCode }
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.from('messages').insert({
    chat_id: chatId,
    role: message.role,
    parts: message.parts,
    attachments: message.experimental_attachments ?? [],
    created_at: new Date(),
    content: message.content,
    model_code: message.model_code
  })

  if (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to save messages')
  }

  return data
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('messages')
      .select()
      .eq('chat_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      throw new ChatSDKError('bad_request:database', 'Failed to get messages by chat id')
    }

    return data
  } catch {
    throw new ChatSDKError('bad_request:database', 'Failed to get messages by chat id')
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours
}: {
  id: string
  differenceInHours: number
}) {
  try {
    const supabase = await createClient()

    const since = new Date(Date.now() - differenceInHours * 60 * 60 * 1000).toISOString()

    const { count, error: messagesError } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', since)
      .eq('role', 'user')
      .eq('user_id', id)

    if (messagesError) {
      throw new ChatSDKError(
        'bad_request:database',
        'Failed to count messages in getMessageCountByUserId'
      )
    }

    return count ?? 0
  } catch {
    throw new ChatSDKError('bad_request:database', 'Failed to get message count by user id')
  }
}

export async function getUserSubscriptionByUserId({ userId }: { userId: string }) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error)
    throw new ChatSDKError('bad_request:database', 'Failed to get user subscription by user id')

  return data
}

export async function getUserByStripeCustomerId({
  stripeCustomerId
}: {
  stripeCustomerId: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_customer_id', stripeCustomerId)
    .single()

  if (error)
    throw new ChatSDKError('bad_request:database', 'Failed to get user by stripe customer id')

  return data
}

export async function updateUserSubscription(
  userId: string,
  subscriptionData: {
    stripeCustomerId?: string
    stripeProductId: string | null
    stripePriceId: string | null
    stripeSubscriptionId: string | null
    planName: string | null
    subscriptionStatus: string
  }
) {
  const supabase = await createClient()

  const transformedSubscriptionData = {
    stripe_customer_id: subscriptionData.stripeCustomerId,
    stripe_subscription_id: subscriptionData.stripeSubscriptionId,
    stripe_product_id: subscriptionData.stripeProductId,
    stripe_price_id: subscriptionData.stripePriceId,
    plan_name: subscriptionData.planName,
    status: subscriptionData.subscriptionStatus
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      ...transformedSubscriptionData,
      updated_at: new Date()
    })
    .eq('user_id', userId)

  if (error) throw new ChatSDKError('bad_request:database', 'Failed to update user subscription')

  return data
}

export async function getPlanNameByUserId({ userId }: { userId: string }) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('subscriptions')
    .select('plan_name')
    .eq('user_id', userId)
    .single()

  if (error) throw new ChatSDKError('bad_request:database', 'Failed to get plan name by user id')

  return data?.plan_name
}

export async function createSubscription({
  stripeCustomerId,
  stripeProductId,
  stripePriceId,
  stripeSubscriptionId,
  planName,
  subscriptionStatus
}: {
  stripeCustomerId: string
  stripeProductId: string
  stripePriceId: string
  stripeSubscriptionId: string
  planName: string
  subscriptionStatus: string
}) {
  const supabase = await createClient(process.env.SUPABASE_SERVICE_ROLE_KEY)

  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .insert({
      stripe_customer_id: stripeCustomerId,
      stripe_product_id: stripeProductId,
      stripe_price_id: stripePriceId,
      stripe_subscription_id: stripeSubscriptionId,
      plan_name: planName,
      status: subscriptionStatus,
      created_at: new Date(),
      updated_at: new Date()
    })
    .select()
    .single()

  if (subscriptionError) {
    console.error('Failed to create user subscription', subscriptionError)

    return
  }

  return { subscription }
}

export async function saveOAuthTokens({
  userId,
  provider,
  accessToken,
  refreshToken,
  expiresIn,
}: {
  userId: string;
  provider: string;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}) {
  const supabase = await createClient();
  const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null;

  console.log('Attempting to save OAuth tokens:', {
    userId,
    provider,
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    expiresAt,
    expiresIn
  });

  // Use upsert to insert or update based on the unique constraint (user_id, provider)
  const { error } = await supabase
    .from('user_oauth_accounts')
    .upsert({
      user_id: userId,
      provider,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,provider'
    });

  if (error) {
    console.error('Supabase upsert error:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      error: error
    });
    throw new ChatSDKError('bad_request:database', `Failed to save OAuth tokens for ${provider}: ${error.message}`);
  }

  console.log('OAuth tokens saved successfully');
  return true;
}

export async function refreshOAuthToken({
  userId,
  provider,
  refreshToken,
  clientId,
  clientSecret,
}: {
  userId: string;
  provider: string;
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}): Promise<{ accessToken: string; refreshToken?: string; expiresIn?: number } | null> {
  try {
    // Different MCP providers have different token refresh endpoints
    const tokenUrls = {
      linear: 'https://mcp.linear.app/token',
      notion: 'https://mcp.notion.com/token',
      asana: 'https://mcp.asana.com/token'
    };

    const redirectUris = {
      linear: process.env.NODE_ENV === 'production'
        ? 'https://affogato.app/api/auth/linear/callback'
        : 'http://localhost:3000/api/auth/linear/callback',
      notion: process.env.NODE_ENV === 'production'
        ? 'https://affogato.app/api/auth/notion/callback'
        : 'http://localhost:3000/api/auth/notion/callback',
      asana: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/asana/callback`
    };

    const tokenUrl = tokenUrls[provider as keyof typeof tokenUrls];
    const redirectUri = redirectUris[provider as keyof typeof redirectUris];

    if (!tokenUrl) {
      console.error(`Unsupported provider for token refresh: ${provider}`);
      return null;
    }

    console.log(`Attempting to refresh ${provider} token...`);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to refresh ${provider} token:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return null;
    }

    const tokenData = await response.json();
    console.log(`Successfully refreshed ${provider} token`);

    // Save the new tokens to database
    await saveOAuthTokens({
      userId,
      provider,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || refreshToken, // Use new refresh token if provided, otherwise keep existing
      expiresIn: tokenData.expires_in,
    });

    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || refreshToken,
      expiresIn: tokenData.expires_in,
    };

  } catch (error) {
    console.error(`Error refreshing ${provider} token:`, error);
    return null;
  }
}

export async function getOAuthTokensFromProvider({ userId, provider }: { userId: string; provider: string }): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: string | null } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_oauth_accounts')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', userId)
    .eq('provider', provider)
    .single();

  if (error || !data || !data.access_token) {
    return null;
  }

  // Check if token is expired
  if (data.expires_at) {
    const expirationTime = new Date(data.expires_at).getTime();
    const currentTime = Date.now();
    const fiveMinutesInMs = 5 * 60 * 1000; // 5 minutes buffer

    // If token expires within 5 minutes, try to refresh it
    if (expirationTime <= currentTime + fiveMinutesInMs) {
      console.log(`${provider} token is expired or expiring soon, attempting refresh...`);

      if (data.refresh_token) {
        // For MCP providers, we need to get the client credentials from the stored DCR data
        // Since DCR credentials are ephemeral, we'll need to re-authenticate if refresh fails
        console.log(`Attempting to refresh ${provider} token with refresh token`);

        // For now, we'll return null to force re-authentication
        // In a production system, you might want to store DCR credentials more persistently
        console.log(`${provider} token expired. User needs to re-authenticate.`);
        return null;
      } else {
        console.log(`${provider} token expired and no refresh token available`);
        return null;
      }
    }
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at || null,
  };
}

export async function getAllOAuthTokens({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_oauth_accounts')
    .select('access_token, refresh_token, expires_at, provider')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching OAuth tokens:', error);

    return null;
  }

  return data;
}

export async function deleteOAuthTokens({
  userId,
  provider,
}: {
  userId: string;
  provider: string;
}): Promise<boolean> {
  const supabase = await createClient();

  console.log(`Deleting OAuth tokens for ${provider} user ${userId}`);

  const { error } = await supabase
    .from('user_oauth_accounts')
    .delete()
    .eq('user_id', userId)
    .eq('provider', provider);

  if (error) {
    console.error(`Failed to delete ${provider} tokens:`, error);
    return false;
  }

  console.log(`Successfully deleted ${provider} tokens`);
  return true;
}
