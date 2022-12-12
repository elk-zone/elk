// TODO @Shinigami92 2022-12-12: @Shinigami92 might add @types/opengraph-io to DefinitelyTyped
// Or directly to the repo

declare module 'opengraph-io' {
    function opengraph(options: {
        appId: string
        fullRender?: boolean
    }): {
        getSiteInfo(url: string): Promise<{
            hybridGraph: {
                image: string
            },
            openGraph: {
                image: {
                    url: string
                }
            }
        }>
    }
    export = opengraph
}