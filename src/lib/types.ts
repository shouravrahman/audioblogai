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
