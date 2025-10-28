export type BlogPost = {
    userId: string;
    title: string;
    content: string;
    status: 'processing' | 'completed' | 'failed';
    createdAt: string;
    updatedAt: string;
};
