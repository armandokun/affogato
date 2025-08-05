import { UIMessage } from 'ai'

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
  message: UIMessage & { model_code: LanguageModelCode }
}) {
  const supabase = await createClient()

  const attachments = message.parts.filter(part => part.type === 'file').map(part => ({
      url: part.url,
      filename: part.filename,
      media_type: part.mediaType
    }))

  const { data, error } = await supabase.from('messages').insert({
    chat_id: chatId,
    role: message.role,
    parts: message.parts,
    attachments,
    created_at: new Date(),
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

  return true;
}

export async function updateAccessToken({
  userId,
  provider,
  accessToken,
}: {
  userId: string;
  provider: string;
  accessToken: string | null;
}) {
  const supabase = await createClient();

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

  return true;
}

export async function getOAuthTokensFromProvider({ userId, provider }: { userId: string; provider: string }): Promise<{ accessToken: string, clientId: string, clientSecret: string } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_integrations')
    .select('access_token, client_id, client_secret')
    .eq('user_id', userId)
    .eq('provider', provider)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;

    console.error(`Error fetching integration for ${provider} user ${userId}`, error);

    return null;
  }

  if (!data) {
    console.error(`No integration found for ${provider} user ${userId}`);

    return null;
  }

  return {
    accessToken: data.access_token,
    clientId: data.client_id,
    clientSecret: data.client_secret,
  }
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

  const { error } = await supabase
    .from('user_integrations')
    .delete()
    .eq('user_id', userId)
    .eq('provider', provider);

  if (error) {
    console.error(`Failed to delete ${provider} integration:`, error);
    return false;
  }

  return true;
}
