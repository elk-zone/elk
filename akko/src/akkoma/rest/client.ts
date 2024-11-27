import type * as v1 from "./v1";
import type * as v2 from "./v2";

export interface Client {
  readonly v1: {
    readonly admin: v1.AdminRepository;
    readonly accounts: v1.AccountRepository;
    readonly announcements: v1.AnnouncementRepository;
    readonly apps: v1.AppRepository;
    readonly blocks: v1.BlockRepository;
    readonly bookmarks: v1.BookmarkRepository;
    readonly conversations: v1.ConversationRepository;
    readonly customEmojis: v1.CustomEmojiRepository;
    readonly directory: v1.DirectoryRepository;
    readonly domainBlocks: v1.DomainBlockRepository;
    readonly endorsements: v1.EndorsementRepository;
    readonly favourites: v1.FavouriteRepository;
    readonly featuredTags: v1.FeaturedTagRepository;
    readonly filters: v1.FilterRepository;
    readonly followRequests: v1.FollowRequestRepository;
    readonly instance: v1.InstanceRepository;
    readonly lists: v1.ListRepository;
    readonly markers: v1.MarkerRepository;
    readonly media: v1.MediaAttachmentRepository;
    readonly mutes: v1.MuteRepository;
    readonly notifications: v1.NotificationRepository;
    readonly polls: v1.PollRepository;
    readonly preferences: v1.PreferenceRepository;
    readonly reports: v1.ReportRepository;
    readonly scheduledStatuses: v1.ScheduledStatusRepository;
    readonly search: v1.SearchRepository;
    readonly statuses: v1.StatusRepository;
    readonly suggestions: v1.SuggestionRepository;
    readonly timelines: v1.TimelineRepository;
    readonly trends: v1.TrendRepository;
    readonly emails: v1.EmailRepository;
    readonly tags: v1.TagRepository;
    readonly followedTags: v1.FollowedTagRepository;
    readonly push: v1.PushRepository;
    readonly profile: v1.ProfileRepository;
  };
  readonly v2: {
    readonly filters: v2.FilterRepository;
    readonly instance: v2.InstanceRepository;
    readonly media: v2.MediaAttachmentRepository;
    readonly notifications: v2.NotificationRepository;
    readonly suggestions: v2.SuggestionRepository;
    readonly search: v2.SearchRepository;
  };
}
