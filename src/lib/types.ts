export type BlogPost = {
    userId: string;
    title: string;
    content: string;
    status: 'processing' | 'completed' | 'failed';
    createdAt: string;
    updatedAt: string;
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
    status: string;
    renewsAt: string | null;
    endsAt: string | null;
    trialEndsAt: string | null;
    planId: number;
};
