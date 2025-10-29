export type BlogPost = {
    userId: string;
    title: string;
    content: string;
    status: 'processing' | 'completed' | 'failed';
    language: string;
    createdAt: string;
    updatedAt: string;
    coverImageUrl?: string;
};

export type AiModel = {
    userId: string;
    name: string;
    description?: string;
    trainingData: string;
    createdAt: string;
};

export type UserSubscription = {
    userId: string;
    lemonSqueezyId: string;
    orderId: number;
    name: string;
    email: string;
    status: 'active' | 'cancelled' | 'expired' | 'past_due' | 'on_trial' | 'unpaid' | 'paused';
    renewsAt: string | null;
    endsAt: string | null;
    trialEndsAt: string | null;
    planId: number;
    customerPortalUrl: string | null;
};
