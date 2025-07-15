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

export async function saveIntegration({
  userId,
  provider,
  clientId,
  clientSecret,
  accessToken,
}: {
  userId: string;
  provider: string;
  clientId: string;
  clientSecret: string;
  accessToken?: string;
}) {
  const supabase = await createClient();

  console.log('Attempting to save integration:', {
    userId,
    provider,
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    hasAccessToken: !!accessToken,
  });

  // Use upsert to insert or update based on the unique constraint (user_id, provider)
  const { error } = await supabase
    .from('user_integrations')
    .upsert({
      user_id: userId,
      provider,
      client_id: clientId,
      client_secret: clientSecret,
      access_token: accessToken,
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

    throw new ChatSDKError('bad_request:database', `Failed to save integration for ${provider}: ${error.message}`);
  }

  console.log('Integration saved successfully');
  return true;
}

export async function updateAccessToken({
  userId,
  provider,
  accessToken,
}: {
  userId: string;
  provider: string;
  accessToken: string;
}) {
  const supabase = await createClient();

  console.log('Attempting to update access token:', {
    userId,
    provider,
    hasAccessToken: !!accessToken,
  });

  const { error } = await supabase
    .from('user_integrations')
    .update({
      access_token: accessToken,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('provider', provider);

  if (error) {
    console.error('Failed to update access token:', error);
    throw new ChatSDKError('bad_request:database', `Failed to update access token for ${provider}: ${error.message}`);
  }

  console.log('Access token updated successfully');
  return true;
}

export async function getOAuthTokensFromProvider({ userId, provider }: { userId: string; provider: string }): Promise<{ accessToken: string } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_integrations')
    .select('access_token, client_id, client_secret')
    .eq('user_id', userId)
    .eq('provider', provider)
    .single();

  if (error || !data) {
    console.log(`No integration found for ${provider} user ${userId}`);
    return null;
  }

  // If we have an access token, return it
  if (data.access_token) {
    return {
      accessToken: data.access_token,
    };
  }

  // If we don't have an access token but have DCR credentials, try to get one
  if (data.client_id && data.client_secret) {
    console.log(`No access token found for ${provider}, attempting automatic reauthorization...`);

    const reauthorizationResult = await performAutomaticReauthorization({
      userId,
      provider,
    });

    if (reauthorizationResult) {
      console.log(`${provider} token successfully reauthorized automatically`);
      return {
        accessToken: reauthorizationResult.accessToken,
      };
    } else {
      console.log(`${provider} automatic reauthorization failed. User needs to re-authenticate.`);
      return null;
    }
  }

  console.log(`No access token or DCR credentials found for ${provider} user ${userId}`);
  return null;
}

export async function getAllIntegrations({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_integrations')
    .select('access_token, provider, client_id, client_secret')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching integrations:', error);

    return null;
  }

  return data;
}

export async function deleteIntegration({
  userId,
  provider,
}: {
  userId: string;
  provider: string;
}): Promise<boolean> {
  const supabase = await createClient();

  console.log(`Deleting integration for ${provider} user ${userId}`);

  const { error } = await supabase
    .from('user_integrations')
    .delete()
    .eq('user_id', userId)
    .eq('provider', provider);

  if (error) {
    console.error(`Failed to delete ${provider} integration:`, error);
    return false;
  }

  console.log(`Successfully deleted ${provider} integration`);
  return true;
}

export async function getDCRCredentials({
  userId,
  provider,
}: {
  userId: string;
  provider: string;
}): Promise<{ clientId: string; clientSecret: string } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_integrations')
    .select('client_id, client_secret')
    .eq('user_id', userId)
    .eq('provider', provider)
    .single();

  if (error || !data || !data.client_id || !data.client_secret) {
    console.log(`No DCR credentials found for ${provider} user ${userId}`);
    return null;
  }

  return {
    clientId: data.client_id,
    clientSecret: data.client_secret,
  };
}

// === Automatic Reauthorization ===

export async function performAutomaticReauthorization({
  userId,
  provider,
}: {
  userId: string;
  provider: string;
}): Promise<{ accessToken: string; refreshToken?: string; expiresIn?: number } | null> {
  console.log(`Starting automatic reauthorization for ${provider} user ${userId}`);

  try {
    // First, try to get existing DCR credentials
    let dcrCredentials = await getDCRCredentials({ userId, provider });

    // If no DCR credentials exist, perform DCR
    if (!dcrCredentials) {
      console.log(`No DCR credentials found for ${provider}, performing DCR...`);
      dcrCredentials = await performDCR({ userId, provider });

      if (!dcrCredentials) {
        console.error(`Failed to perform DCR for ${provider}`);
        return null;
      }
    }

    // Perform device authorization flow or implicit grant
    // For MCP providers, we can use the client credentials directly
    const tokenData = await exchangeClientCredentialsForToken({
      provider,
      clientId: dcrCredentials.clientId,
      clientSecret: dcrCredentials.clientSecret,
    });

    if (!tokenData) {
      console.error(`Failed to exchange client credentials for token: ${provider}`);
      return null;
    }

    // Save the new access token to the same record
    await updateAccessToken({
      userId,
      provider,
      accessToken: tokenData.accessToken,
    });

    console.log(`Successfully completed automatic reauthorization for ${provider}`);
    return tokenData;

  } catch (error) {
    console.error(`Error during automatic reauthorization for ${provider}:`, error);
    return null;
  }
}

async function performDCR({
  userId,
  provider,
}: {
  userId: string;
  provider: string;
}): Promise<{ clientId: string; clientSecret: string } | null> {
  const registrationUrls = {
    linear: 'https://mcp.linear.app/register',
    notion: 'https://mcp.notion.com/register',
    asana: 'https://mcp.asana.com/register',
  };

  const redirectUris = {
    linear: process.env.NODE_ENV === 'production'
      ? 'https://affogato.app/api/auth/linear/callback'
      : 'http://localhost:3000/api/auth/linear/callback',
    notion: process.env.NODE_ENV === 'production'
      ? 'https://affogato.app/api/auth/notion/callback'
      : 'http://localhost:3000/api/auth/notion/callback',
    asana: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/asana/callback`,
  };

  const registrationUrl = registrationUrls[provider as keyof typeof registrationUrls];
  const redirectUri = redirectUris[provider as keyof typeof redirectUris];

  if (!registrationUrl) {
    console.error(`Unsupported provider for DCR: ${provider}`);
    return null;
  }

  try {
    console.log(`Performing DCR for ${provider}...`);

    const response = await fetch(registrationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_name: 'affogato.chat',
        redirect_uris: [redirectUri],
        grant_types: ['authorization_code', 'client_credentials'],
        response_types: ['code'],
        token_endpoint_auth_method: 'client_secret_post',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DCR failed for ${provider}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return null;
    }

    const registrationData = await response.json();
    console.log(`DCR successful for ${provider}`);

    // Save DCR credentials to the integrations table
    await saveIntegration({
      userId,
      provider,
      clientId: registrationData.client_id,
      clientSecret: registrationData.client_secret,
    });

    return {
      clientId: registrationData.client_id,
      clientSecret: registrationData.client_secret,
    };

  } catch (error) {
    console.error(`Error during DCR for ${provider}:`, error);
    return null;
  }
}

async function exchangeClientCredentialsForToken({
  provider,
  clientId,
  clientSecret,
}: {
  provider: string;
  clientId: string;
  clientSecret: string;
}): Promise<{ accessToken: string; refreshToken?: string; expiresIn?: number } | null> {
  const tokenUrls = {
    linear: 'https://mcp.linear.app/token',
    notion: 'https://mcp.notion.com/token',
    asana: 'https://mcp.asana.com/token',
  };

  const tokenUrl = tokenUrls[provider as keyof typeof tokenUrls];

  if (!tokenUrl) {
    console.error(`Unsupported provider for token exchange: ${provider}`);
    return null;
  }

  try {
    console.log(`Exchanging client credentials for token: ${provider}`);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Token exchange failed for ${provider}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return null;
    }

    const tokenData = await response.json();
    console.log(`Token exchange successful for ${provider}`);

    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
    };

  } catch (error) {
    console.error(`Error during token exchange for ${provider}:`, error);
    return null;
  }
}
