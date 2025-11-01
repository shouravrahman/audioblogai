export type Events = {
    'app/article.generate': AppArticleGenerate;
}

type AppArticleGenerate = {
    data: {
        articleId: string;
        userId: string;
        audioDataUri: string;
        selectedModel: string;
        language: string;
        blogType: string;
        wordCount: string;
    },
    user: {
        id: string;
    }
}
