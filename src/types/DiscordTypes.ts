export interface DISCORD_MESSAGE {
    type: string;
    content: string;
    mentions: any[];
    mention_roles: any[];
    attachments: any[];
    embeds: [
        {
            type: string;
            title: string;
            description: string;
            color: number;
            content_scan_version: number;
        }
    ];
    timestamp: string;
    edited_timestamp: string;
    flags: string;
    components: any[];
    id: string;
    channel_id: string;
    author: {
        id: string;
        username: string;
        avatar: string;
        discriminator: string;
        public_flags: number;
        flags: number;
        bot: true;
        banner: any;
        accent_color: any;
        global_name: any;
        avatar_decoration_data: any;
        banner_color: any;
        clan: any;
        primary_guild: any;
    };
    pinned: boolean;
    mention_everyone: boolean;
    tts: boolean;
}

export interface HAR_ENTRY {
    request: {
        method: string;
        url: string;
        headers: Record<string, string>;
        bodySize: number;
        cookies: string[];
        postData?: {
            text: string;
        };
    };
    response: {
        status: number;
        statusText: string;
        headers: Record<string, string>;
        content: {
            size: number;
            mimeType: string;
            text: string;
        };
    };
}