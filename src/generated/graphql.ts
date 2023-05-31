import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;

/** Ordering options for enterprise member connections. */
export interface EnterpriseMemberOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order enterprise members by. */
  field: EnterpriseMemberOrderField;
}
/** Ordering options for Enterprise Server installation connections. */
export interface EnterpriseServerInstallationOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order Enterprise Server installations by. */
  field: EnterpriseServerInstallationOrderField;
}
/** Ordering options for Enterprise Server user account connections. */
export interface EnterpriseServerUserAccountOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order user accounts by. */
  field: EnterpriseServerUserAccountOrderField;
}
/** Ordering options for Enterprise Server user account email connections. */
export interface EnterpriseServerUserAccountEmailOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order emails by. */
  field: EnterpriseServerUserAccountEmailOrderField;
}
/** Ordering options for Enterprise Server user accounts upload connections. */
export interface EnterpriseServerUserAccountsUploadOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order user accounts uploads by. */
  field: EnterpriseServerUserAccountsUploadOrderField;
}
/** Ordering options for organization connections. */
export interface OrganizationOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order organizations by. */
  field: OrganizationOrderField;
}
/** Ordering options for user status connections. */
export interface UserStatusOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order user statuses by. */
  field: UserStatusOrderField;
}
/** Ways in which lists of packages can be ordered upon return. */
export interface PackageOrder {
  /** The direction in which to order packages by the specified field. */
  direction?: Maybe<OrderDirection>;
  /** The field in which to order packages by. */
  field?: Maybe<PackageOrderField>;
}
/** Ways in which lists of package files can be ordered upon return. */
export interface PackageFileOrder {
  /** The direction in which to order package files by the specified field. */
  direction?: Maybe<OrderDirection>;
  /** The field in which to order package files by. */
  field?: Maybe<PackageFileOrderField>;
}
/** Ways in which lists of reactions can be ordered upon return. */
export interface ReactionOrder {
  /** The direction in which to order reactions by the specified field. */
  direction: OrderDirection;
  /** The field in which to order reactions by. */
  field: ReactionOrderField;
}
/** Ways in which lists of labels can be ordered upon return. */
export interface LabelOrder {
  /** The direction in which to order labels by the specified field. */
  direction: OrderDirection;
  /** The field in which to order labels by. */
  field: LabelOrderField;
}
/** Ways in which to filter lists of issues. */
export interface IssueFilters {
  /** List issues assigned to given name. Pass in `null` for issues with no assigned user, and `*` for issues assigned to any user. */
  assignee?: Maybe<string>;
  /** List issues created by given name. */
  createdBy?: Maybe<string>;
  /** List issues where the list of label names exist on the issue. */
  labels?: Maybe<string[]>;
  /** List issues where the given name is mentioned in the issue. */
  mentioned?: Maybe<string>;
  /** List issues by given milestone argument. If an string representation of an integer is passed, it should refer to a milestone by its database ID. Pass in `null` for issues with no milestone, and `*` for issues that are assigned to any milestone. */
  milestone?: Maybe<string>;
  /** List issues by given milestone argument. If an string representation of an integer is passed, it should refer to a milestone by its number field. Pass in `null` for issues with no milestone, and `*` for issues that are assigned to any milestone. */
  milestoneNumber?: Maybe<string>;
  /** List issues that have been updated at or after the given date. */
  since?: Maybe<DateTime>;
  /** List issues filtered by the list of states given. */
  states?: Maybe<IssueState[]>;
  /** List issues subscribed to by viewer. */
  viewerSubscribed?: boolean;
}
/** Ways in which lists of issues can be ordered upon return. */
export interface IssueOrder {
  /** The direction in which to order issues by the specified field. */
  direction: OrderDirection;
  /** The field in which to order issues by. */
  field: IssueOrderField;
}
/** Ways in which lists of projects can be ordered upon return. */
export interface ProjectV2Order {
  /** The direction in which to order projects by the specified field. */
  direction: OrderDirection;
  /** The field in which to order projects by. */
  field: ProjectV2OrderField;
}
/** Ordering options for project v2 field connections */
export interface ProjectV2FieldOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order the project v2 fields by. */
  field: ProjectV2FieldOrderField;
}
/** Ordering options for project v2 item connections */
export interface ProjectV2ItemOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order the project v2 items by. */
  field: ProjectV2ItemOrderField;
}
/** Ways in which lists of issues can be ordered upon return. */
export interface PullRequestOrder {
  /** The direction in which to order pull requests by the specified field. */
  direction: OrderDirection;
  /** The field in which to order pull requests by. */
  field: PullRequestOrderField;
}
/** Ways in which team connections can be ordered. */
export interface TeamOrder {
  /** The direction in which to order nodes. */
  direction: OrderDirection;
  /** The field in which to order nodes by. */
  field: TeamOrderField;
}
/** Ways in which team discussion comment connections can be ordered. */
export interface TeamDiscussionCommentOrder {
  /** The direction in which to order nodes. */
  direction: OrderDirection;
  /** The field by which to order nodes. */
  field: TeamDiscussionCommentOrderField;
}
/** Ways in which team discussion connections can be ordered. */
export interface TeamDiscussionOrder {
  /** The direction in which to order nodes. */
  direction: OrderDirection;
  /** The field by which to order nodes. */
  field: TeamDiscussionOrderField;
}
/** Ordering options for team member connections */
export interface TeamMemberOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order team members by. */
  field: TeamMemberOrderField;
}
/** Ways in which to filter lists of projects. */
export interface ProjectV2Filters {
  /** List project v2 filtered by the state given. */
  state?: Maybe<ProjectV2State>;
}
/** Ordering options for team repository connections */
export interface TeamRepositoryOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order repositories by. */
  field: TeamRepositoryOrderField;
}
/** Ordering options for project v2 item field value connections */
export interface ProjectV2ItemFieldValueOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order the project v2 item field values by. */
  field: ProjectV2ItemFieldValueOrderField;
}
/** Ordering options for repository connections */
export interface RepositoryOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order repositories by. */
  field: RepositoryOrderField;
}
/** Ordering options for project v2 view connections */
export interface ProjectV2ViewOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order the project v2 views by. */
  field: ProjectV2ViewOrderField;
}
/** Ordering options for project v2 workflows connections */
export interface ProjectV2WorkflowOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order the project v2 workflows by. */
  field: ProjectV2WorkflowsOrderField;
}
/** Ordering options for IP allow list entry connections. */
export interface IpAllowListEntryOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order IP allow list entries by. */
  field: IpAllowListEntryOrderField;
}
/** The filters that are available when fetching check suites. */
export interface CheckSuiteFilter {
  /** Filters the check suites created by this application ID. */
  appId?: Maybe<number>;
  /** Filters the check suites by this name. */
  checkName?: Maybe<string>;
}
/** The filters that are available when fetching check runs. */
export interface CheckRunFilter {
  /** Filters the check runs created by this application ID. */
  appId?: Maybe<number>;
  /** Filters the check runs by this name. */
  checkName?: Maybe<string>;
  /** Filters the check runs by this type. */
  checkType?: Maybe<CheckRunType>;
  /** Filters the check runs by these conclusions. */
  conclusions?: Maybe<CheckConclusionState[]>;
  /** Filters the check runs by this status. Superceded by statuses. */
  status?: Maybe<CheckStatusState>;
  /** Filters the check runs by this status. Overrides status. */
  statuses?: Maybe<CheckStatusState[]>;
}
/** Ways in which lists of workflow runs can be ordered upon return. */
export interface WorkflowRunOrder {
  /** The direction in which to order workflow runs by the specified field. */
  direction: OrderDirection;
  /** The field by which to order workflows. */
  field: WorkflowRunOrderField;
}
/** Ordering options for deployment connections */
export interface DeploymentOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order deployments by. */
  field: DeploymentOrderField;
}
/** Specifies an author for filtering Git commits. */
export interface CommitAuthor {
  /** Email addresses to filter by. Commits authored by any of the specified email addresses will be returned. */
  emails?: Maybe<string[]>;
  /** ID of a User to filter by. If non-null, only commits authored by this user will be returned. This field takes precedence over emails. */
  id?: Maybe<string>;
}
/** Ways in which lists of issue comments can be ordered upon return. */
export interface IssueCommentOrder {
  /** The direction in which to order issue comments by the specified field. */
  direction: OrderDirection;
  /** The field in which to order issue comments by. */
  field: IssueCommentOrderField;
}
/** Ordering options for discussion poll option connections. */
export interface DiscussionPollOptionOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order poll options by. */
  field: DiscussionPollOptionOrderField;
}
/** Ways in which lists of projects can be ordered upon return. */
export interface ProjectOrder {
  /** The direction in which to order projects by the specified field. */
  direction: OrderDirection;
  /** The field in which to order projects by. */
  field: ProjectOrderField;
}
/** Ways in which star connections can be ordered. */
export interface StarOrder {
  /** The direction in which to order nodes. */
  direction: OrderDirection;
  /** The field in which to order nodes by. */
  field: StarOrderField;
}
/** Ways in which lists of discussions can be ordered upon return. */
export interface DiscussionOrder {
  /** The direction in which to order discussions by the specified field. */
  direction: OrderDirection;
  /** The field by which to order discussions. */
  field: DiscussionOrderField;
}
/** Ordering options for language connections. */
export interface LanguageOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order languages by. */
  field: LanguageOrderField;
}
/** Ordering options for milestone connections. */
export interface MilestoneOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order milestones by. */
  field: MilestoneOrderField;
}
/** Ways in which lists of git refs can be ordered upon return. */
export interface RefOrder {
  /** The direction in which to order refs by the specified field. */
  direction: OrderDirection;
  /** The field in which to order refs by. */
  field: RefOrderField;
}
/** Ways in which lists of releases can be ordered upon return. */
export interface ReleaseOrder {
  /** The direction in which to order releases by the specified field. */
  direction: OrderDirection;
  /** The field in which to order releases by. */
  field: ReleaseOrderField;
}
/** Ordering options for security vulnerability connections */
export interface SecurityVulnerabilityOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order security vulnerabilities by. */
  field: SecurityVulnerabilityOrderField;
}
/** Ways in which lists of package versions can be ordered upon return. */
export interface PackageVersionOrder {
  /** The direction in which to order package versions by the specified field. */
  direction?: Maybe<OrderDirection>;
  /** The field in which to order package versions by. */
  field?: Maybe<PackageVersionOrderField>;
}
/** Ordering options for gist connections */
export interface GistOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order repositories by. */
  field: GistOrderField;
}
/** Ordering options for connections to get sponsor entities for GitHub Sponsors. */
export interface SponsorOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order sponsor entities by. */
  field: SponsorOrderField;
}
/** Ordering options for GitHub Sponsors activity connections. */
export interface SponsorsActivityOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order activity by. */
  field: SponsorsActivityOrderField;
}
/** Ordering options for sponsorship connections. */
export interface SponsorshipOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order sponsorship by. */
  field: SponsorshipOrderField;
}
/** Ordering options for Sponsors tiers connections. */
export interface SponsorsTierOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order tiers by. */
  field: SponsorsTierOrderField;
}
/** Ordering options for sponsorship newsletter connections. */
export interface SponsorshipNewsletterOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order sponsorship newsletters by. */
  field: SponsorshipNewsletterOrderField;
}
/** Ordering options for commit contribution connections. */
export interface CommitContributionOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field by which to order commit contributions. */
  field: CommitContributionOrderField;
}
/** Ordering options for contribution connections. */
export interface ContributionOrder {
  /** The ordering direction. */
  direction: OrderDirection;
}
/** Ordering options for saved reply connections. */
export interface SavedReplyOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order saved replies by. */
  field: SavedReplyOrderField;
}
/** Ordering options for Audit Log connections. */
export interface AuditLogOrder {
  /** The ordering direction. */
  direction?: Maybe<OrderDirection>;
  /** The field to order Audit Logs by. */
  field?: Maybe<AuditLogOrderField>;
}
/** Ordering options for verifiable domain connections. */
export interface VerifiableDomainOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order verifiable domains by. */
  field: VerifiableDomainOrderField;
}
/** Ordering options for an organization's enterprise owner connections. */
export interface OrgEnterpriseOwnerOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order enterprise owners by. */
  field: OrgEnterpriseOwnerOrderField;
}
/** Ordering options for mannequins. */
export interface MannequinOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order mannequins by. */
  field: MannequinOrderField;
}
/** Ordering options for repository migrations. */
export interface RepositoryMigrationOrder {
  /** The ordering direction. */
  direction: RepositoryMigrationOrderDirection;
  /** The field to order repository migrations by. */
  field: RepositoryMigrationOrderField;
}
/** Ordering options for enterprise administrator invitation connections */
export interface EnterpriseAdministratorInvitationOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order enterprise administrator invitations by. */
  field: EnterpriseAdministratorInvitationOrderField;
}
/** Ordering options for repository invitation connections. */
export interface RepositoryInvitationOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order repository invitations by. */
  field: RepositoryInvitationOrderField;
}
/** An advisory identifier to filter results on. */
export interface SecurityAdvisoryIdentifierFilter {
  /** The identifier type. */
  type: SecurityAdvisoryIdentifierType;
  /** The identifier string. Supports exact or partial matching. */
  value: string;
}
/** Ordering options for security advisory connections */
export interface SecurityAdvisoryOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order security advisories by. */
  field: SecurityAdvisoryOrderField;
}
/** Ordering options for connections to get sponsorable entities for GitHub Sponsors. */
export interface SponsorableOrder {
  /** The ordering direction. */
  direction: OrderDirection;
  /** The field to order sponsorable entities by. */
  field: SponsorableOrderField;
}
/** Autogenerated input type of AbortQueuedMigrations */
export interface AbortQueuedMigrationsInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the organization that is running the migrations. */
  ownerId: string;
}
/** Autogenerated input type of AcceptEnterpriseAdministratorInvitation */
export interface AcceptEnterpriseAdministratorInvitationInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The id of the invitation being accepted */
  invitationId: string;
}
/** Autogenerated input type of AcceptTopicSuggestion */
export interface AcceptTopicSuggestionInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The name of the suggested topic. */
  name: string;
  /** The Node ID of the repository. */
  repositoryId: string;
}
/** Autogenerated input type of AddAssigneesToAssignable */
export interface AddAssigneesToAssignableInput {
  /** The id of the assignable object to add assignees to. */
  assignableId: string;
  /** The id of users to add as assignees. */
  assigneeIds: string[];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
}
/** Autogenerated input type of AddComment */
export interface AddCommentInput {
  /** The contents of the comment. */
  body: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the subject to modify. */
  subjectId: string;
}
/** Autogenerated input type of AddDiscussionComment */
export interface AddDiscussionCommentInput {
  /** The contents of the comment. */
  body: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the discussion to comment on. */
  discussionId: string;
  /** The Node ID of the discussion comment within this discussion to reply to. */
  replyToId?: Maybe<string>;
}
/** Autogenerated input type of AddDiscussionPollVote */
export interface AddDiscussionPollVoteInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the discussion poll option to vote for. */
  pollOptionId: string;
}
/** Autogenerated input type of AddEnterpriseOrganizationMember */
export interface AddEnterpriseOrganizationMemberInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise which owns the organization. */
  enterpriseId: string;
  /** The ID of the organization the users will be added to. */
  organizationId: string;
  /** The role to assign the users in the organization */
  role?: Maybe<OrganizationMemberRole>;
  /** The IDs of the enterprise members to add. */
  userIds: string[];
}
/** Autogenerated input type of AddEnterpriseSupportEntitlement */
export interface AddEnterpriseSupportEntitlementInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the Enterprise which the admin belongs to. */
  enterpriseId: string;
  /** The login of a member who will receive the support entitlement. */
  login: string;
}
/** Autogenerated input type of AddLabelsToLabelable */
export interface AddLabelsToLabelableInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The id of the labelable object to add labels to. */
  labelableId: string;
  /** The ids of the labels to add. */
  labelIds: string[];
}
/** Autogenerated input type of AddProjectCard */
export interface AddProjectCardInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The content of the card. Must be a member of the ProjectCardItem union */
  contentId?: Maybe<string>;
  /** The note on the card. */
  note?: Maybe<string>;
  /** The Node ID of the ProjectColumn. */
  projectColumnId: string;
}
/** Autogenerated input type of AddProjectColumn */
export interface AddProjectColumnInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The name of the column. */
  name: string;
  /** The Node ID of the project. */
  projectId: string;
}
/** Autogenerated input type of AddProjectV2DraftIssue */
export interface AddProjectV2DraftIssueInput {
  /** The IDs of the assignees of the draft issue. */
  assigneeIds?: Maybe<string[]>;
  /** The body of the draft issue. */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the Project to add the draft issue to. */
  projectId: string;
  /** The title of the draft issue. A project item can also be created by providing the URL of an Issue or Pull Request if you have access. */
  title: string;
}
/** Autogenerated input type of AddProjectV2ItemById */
export interface AddProjectV2ItemByIdInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The id of the Issue or Pull Request to add. */
  contentId: string;
  /** The ID of the Project to add the item to. */
  projectId: string;
}
/** Autogenerated input type of AddPullRequestReview */
export interface AddPullRequestReviewInput {
  /** The contents of the review body comment. */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The review line comments. **Upcoming Change on 2023-10-01 UTC** **Description:** `comments` will be removed. use the `threads` argument instead **Reason:** We are deprecating comment fields that use diff-relative positioning */
  comments?: Maybe<(Maybe<DraftPullRequestReviewComment>)[]>;
  /** The commit OID the review pertains to. */
  commitOID?: Maybe<GitObjectId>;
  /** The event to perform on the pull request review. */
  event?: Maybe<PullRequestReviewEvent>;
  /** The Node ID of the pull request to modify. */
  pullRequestId: string;
  /** The review line comment threads. */
  threads?: Maybe<(Maybe<DraftPullRequestReviewThread>)[]>;
}
/** Specifies a review comment to be left with a Pull Request Review. */
export interface DraftPullRequestReviewComment {
  /** Body of the comment to leave. */
  body: string;
  /** Path to the file being commented on. */
  path: string;
  /** Position in the file to leave a comment on. */
  position: number;
}
/** Specifies a review comment thread to be left with a Pull Request Review. */
export interface DraftPullRequestReviewThread {
  /** Body of the comment to leave. */
  body: string;
  /** The line of the blob to which the thread refers. The end of the line range for multi-line comments. */
  line: number;
  /** Path to the file being commented on. */
  path: string;
  /** The side of the diff on which the line resides. For multi-line comments, this is the side for the end of the line range. */
  side?: DiffSide;
  /** The first line of the range to which the comment refers. */
  startLine?: Maybe<number>;
  /** The side of the diff on which the start line resides. */
  startSide?: DiffSide;
}
/** Autogenerated input type of AddPullRequestReviewComment */
export interface AddPullRequestReviewCommentInput {
  /** The text of the comment. This field is required **Upcoming Change on 2023-10-01 UTC** **Description:** `body` will be removed. use addPullRequestReviewThread or addPullRequestReviewThreadReply instead **Reason:** We are deprecating the addPullRequestReviewComment mutation */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The SHA of the commit to comment on. **Upcoming Change on 2023-10-01 UTC** **Description:** `commitOID` will be removed. use addPullRequestReviewThread or addPullRequestReviewThreadReply instead **Reason:** We are deprecating the addPullRequestReviewComment mutation */
  commitOID?: Maybe<GitObjectId>;
  /** The comment id to reply to. **Upcoming Change on 2023-10-01 UTC** **Description:** `inReplyTo` will be removed. use addPullRequestReviewThread or addPullRequestReviewThreadReply instead **Reason:** We are deprecating the addPullRequestReviewComment mutation */
  inReplyTo?: Maybe<string>;
  /** The relative path of the file to comment on. **Upcoming Change on 2023-10-01 UTC** **Description:** `path` will be removed. use addPullRequestReviewThread or addPullRequestReviewThreadReply instead **Reason:** We are deprecating the addPullRequestReviewComment mutation */
  path?: Maybe<string>;
  /** The line index in the diff to comment on. **Upcoming Change on 2023-10-01 UTC** **Description:** `position` will be removed. use addPullRequestReviewThread or addPullRequestReviewThreadReply instead **Reason:** We are deprecating the addPullRequestReviewComment mutation */
  position?: Maybe<number>;
  /** The node ID of the pull request reviewing **Upcoming Change on 2023-10-01 UTC** **Description:** `pullRequestId` will be removed. use addPullRequestReviewThread or addPullRequestReviewThreadReply instead **Reason:** We are deprecating the addPullRequestReviewComment mutation */
  pullRequestId?: Maybe<string>;
  /** The Node ID of the review to modify. **Upcoming Change on 2023-10-01 UTC** **Description:** `pullRequestReviewId` will be removed. use addPullRequestReviewThread or addPullRequestReviewThreadReply instead **Reason:** We are deprecating the addPullRequestReviewComment mutation */
  pullRequestReviewId?: Maybe<string>;
}
/** Autogenerated input type of AddPullRequestReviewThread */
export interface AddPullRequestReviewThreadInput {
  /** Body of the thread's first comment. */
  body: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The line of the blob to which the thread refers, required for line-level threads. The end of the line range for multi-line comments. */
  line?: Maybe<number>;
  /** Path to the file being commented on. */
  path: string;
  /** The node ID of the pull request reviewing */
  pullRequestId?: Maybe<string>;
  /** The Node ID of the review to modify. */
  pullRequestReviewId?: Maybe<string>;
  /** The side of the diff on which the line resides. For multi-line comments, this is the side for the end of the line range. */
  side?: DiffSide;
  /** The first line of the range to which the comment refers. */
  startLine?: Maybe<number>;
  /** The side of the diff on which the start line resides. */
  startSide?: DiffSide;
  /** The level at which the comments in the corresponding thread are targeted, can be a diff line or a file */
  subjectType?: PullRequestReviewThreadSubjectType;
}
/** Autogenerated input type of AddReaction */
export interface AddReactionInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The name of the emoji to react with. */
  content: ReactionContent;
  /** The Node ID of the subject to modify. */
  subjectId: string;
}
/** Autogenerated input type of AddStar */
export interface AddStarInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Starrable ID to star. */
  starrableId: string;
}
/** Autogenerated input type of AddUpvote */
export interface AddUpvoteInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the discussion or comment to upvote. */
  subjectId: string;
}
/** Autogenerated input type of AddVerifiableDomain */
export interface AddVerifiableDomainInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The URL of the domain */
  domain: Uri;
  /** The ID of the owner to add the domain to */
  ownerId: string;
}
/** Autogenerated input type of ApproveDeployments */
export interface ApproveDeploymentsInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Optional comment for approving deployments */
  comment?: string;
  /** The ids of environments to reject deployments */
  environmentIds: string[];
  /** The node ID of the workflow run containing the pending deployments. */
  workflowRunId: string;
}
/** Autogenerated input type of ApproveVerifiableDomain */
export interface ApproveVerifiableDomainInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the verifiable domain to approve. */
  id: string;
}
/** Autogenerated input type of ArchiveProjectV2Item */
export interface ArchiveProjectV2ItemInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the ProjectV2Item to archive. */
  itemId: string;
  /** The ID of the Project to archive the item from. */
  projectId: string;
}
/** Autogenerated input type of ArchiveRepository */
export interface ArchiveRepositoryInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the repository to mark as archived. */
  repositoryId: string;
}
/** Autogenerated input type of CancelEnterpriseAdminInvitation */
export interface CancelEnterpriseAdminInvitationInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the pending enterprise administrator invitation. */
  invitationId: string;
}
/** Autogenerated input type of CancelSponsorship */
export interface CancelSponsorshipInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the user or organization who is receiving the sponsorship. Required if sponsorableLogin is not given. */
  sponsorableId?: Maybe<string>;
  /** The username of the user or organization who is receiving the sponsorship. Required if sponsorableId is not given. */
  sponsorableLogin?: Maybe<string>;
  /** The ID of the user or organization who is acting as the sponsor, paying for the sponsorship. Required if sponsorLogin is not given. */
  sponsorId?: Maybe<string>;
  /** The username of the user or organization who is acting as the sponsor, paying for the sponsorship. Required if sponsorId is not given. */
  sponsorLogin?: Maybe<string>;
}
/** Autogenerated input type of ChangeUserStatus */
export interface ChangeUserStatusInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The emoji to represent your status. Can either be a native Unicode emoji or an emoji name with colons, e.g., :grinning:. */
  emoji?: Maybe<string>;
  /** If set, the user status will not be shown after this date. */
  expiresAt?: Maybe<DateTime>;
  /** Whether this status should indicate you are not fully available on GitHub, e.g., you are away. */
  limitedAvailability?: boolean;
  /** A short description of your current status. */
  message?: Maybe<string>;
  /** The ID of the organization whose members will be allowed to see the status. If omitted, the status will be publicly visible. */
  organizationId?: Maybe<string>;
}
/** Autogenerated input type of ClearLabelsFromLabelable */
export interface ClearLabelsFromLabelableInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The id of the labelable object to clear the labels from. */
  labelableId: string;
}
/** Autogenerated input type of ClearProjectV2ItemFieldValue */
export interface ClearProjectV2ItemFieldValueInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the field to be cleared. */
  fieldId: string;
  /** The ID of the item to be cleared. */
  itemId: string;
  /** The ID of the Project. */
  projectId: string;
}
/** Autogenerated input type of CloneProject */
export interface CloneProjectInput {
  /** The description of the project. */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Whether or not to clone the source project's workflows. */
  includeWorkflows: boolean;
  /** The name of the project. */
  name: string;
  /** The visibility of the project, defaults to false (private). */
  public?: Maybe<boolean>;
  /** The source project to clone. */
  sourceId: string;
  /** The owner ID to create the project under. */
  targetOwnerId: string;
}
/** Autogenerated input type of CloneTemplateRepository */
export interface CloneTemplateRepositoryInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** A short description of the new repository. */
  description?: Maybe<string>;
  /** Whether to copy all branches from the template to the new repository. Defaults to copying only the default branch of the template. */
  includeAllBranches?: boolean;
  /** The name of the new repository. */
  name: string;
  /** The ID of the owner for the new repository. */
  ownerId: string;
  /** The Node ID of the template repository. */
  repositoryId: string;
  /** Indicates the repository's visibility level. */
  visibility: RepositoryVisibility;
}
/** Autogenerated input type of CloseDiscussion */
export interface CloseDiscussionInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the discussion to be closed. */
  discussionId: string;
  /** The reason why the discussion is being closed. */
  reason?: DiscussionCloseReason;
}
/** Autogenerated input type of CloseIssue */
export interface CloseIssueInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the issue to be closed. */
  issueId: string;
  /** The reason the issue is to be closed. */
  stateReason?: Maybe<IssueClosedStateReason>;
}
/** Autogenerated input type of ClosePullRequest */
export interface ClosePullRequestInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the pull request to be closed. */
  pullRequestId: string;
}
/** Autogenerated input type of ConvertProjectCardNoteToIssue */
export interface ConvertProjectCardNoteToIssueInput {
  /** The body of the newly created issue. */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ProjectCard ID to convert. */
  projectCardId: string;
  /** The ID of the repository to create the issue in. */
  repositoryId: string;
  /** The title of the newly created issue. Defaults to the card's note text. */
  title?: Maybe<string>;
}
/** Autogenerated input type of ConvertPullRequestToDraft */
export interface ConvertPullRequestToDraftInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the pull request to convert to draft */
  pullRequestId: string;
}
/** Autogenerated input type of CopyProjectV2 */
export interface CopyProjectV2Input {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Include draft issues in the new project */
  includeDraftIssues?: boolean;
  /** The owner ID of the new project. */
  ownerId: string;
  /** The ID of the source Project to copy. */
  projectId: string;
  /** The title of the project. */
  title: string;
}
/** Autogenerated input type of CreateAttributionInvitation */
export interface CreateAttributionInvitationInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the owner scoping the reattributable data. */
  ownerId: string;
  /** The Node ID of the account owning the data to reattribute. */
  sourceId: string;
  /** The Node ID of the account which may claim the data. */
  targetId: string;
}
/** Autogenerated input type of CreateBranchProtectionRule */
export interface CreateBranchProtectionRuleInput {
  /** Can this branch be deleted. */
  allowsDeletions?: Maybe<boolean>;
  /** Are force pushes allowed on this branch. */
  allowsForcePushes?: Maybe<boolean>;
  /** Is branch creation a protected operation. */
  blocksCreations?: Maybe<boolean>;
  /** A list of User, Team, or App IDs allowed to bypass force push targeting matching branches. */
  bypassForcePushActorIds?: Maybe<string[]>;
  /** A list of User, Team, or App IDs allowed to bypass pull requests targeting matching branches. */
  bypassPullRequestActorIds?: Maybe<string[]>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Will new commits pushed to matching branches dismiss pull request review approvals. */
  dismissesStaleReviews?: Maybe<boolean>;
  /** Can admins overwrite branch protection. */
  isAdminEnforced?: Maybe<boolean>;
  /** Whether users can pull changes from upstream when the branch is locked. Set to `true` to allow fork syncing. Set to `false` to prevent fork syncing. */
  lockAllowsFetchAndMerge?: Maybe<boolean>;
  /** Whether to set the branch as read-only. If this is true, users will not be able to push to the branch. */
  lockBranch?: Maybe<boolean>;
  /** The glob-like pattern used to determine matching branches. */
  pattern: string;
  /** A list of User, Team, or App IDs allowed to push to matching branches. */
  pushActorIds?: Maybe<string[]>;
  /** The global relay id of the repository in which a new branch protection rule should be created in. */
  repositoryId: string;
  /** Number of approving reviews required to update matching branches. */
  requiredApprovingReviewCount?: Maybe<number>;
  /** The list of required deployment environments */
  requiredDeploymentEnvironments?: Maybe<string[]>;
  /** List of required status check contexts that must pass for commits to be accepted to matching branches. */
  requiredStatusCheckContexts?: Maybe<string[]>;
  /** The list of required status checks */
  requiredStatusChecks?: Maybe<RequiredStatusCheckInput[]>;
  /** Whether the most recent push must be approved by someone other than the person who pushed it */
  requireLastPushApproval?: Maybe<boolean>;
  /** Are approving reviews required to update matching branches. */
  requiresApprovingReviews?: Maybe<boolean>;
  /** Are reviews from code owners required to update matching branches. */
  requiresCodeOwnerReviews?: Maybe<boolean>;
  /** Are commits required to be signed. */
  requiresCommitSignatures?: Maybe<boolean>;
  /** Are conversations required to be resolved before merging. */
  requiresConversationResolution?: Maybe<boolean>;
  /** Are successful deployments required before merging. */
  requiresDeployments?: Maybe<boolean>;
  /** Are merge commits prohibited from being pushed to this branch. */
  requiresLinearHistory?: Maybe<boolean>;
  /** Are status checks required to update matching branches. */
  requiresStatusChecks?: Maybe<boolean>;
  /** Are branches required to be up to date before merging. */
  requiresStrictStatusChecks?: Maybe<boolean>;
  /** Is pushing to matching branches restricted. */
  restrictsPushes?: Maybe<boolean>;
  /** Is dismissal of pull request reviews restricted. */
  restrictsReviewDismissals?: Maybe<boolean>;
  /** A list of User, Team, or App IDs allowed to dismiss reviews on pull requests targeting matching branches. */
  reviewDismissalActorIds?: Maybe<string[]>;
}
/** Specifies the attributes for a new or updated required status check. */
export interface RequiredStatusCheckInput {
  /** The ID of the App that must set the status in order for it to be accepted. Omit this value to use whichever app has recently been setting this status, or use "any" to allow any app to set the status. */
  appId?: Maybe<string>;
  /** Status check context that must pass for commits to be accepted to the matching branch. */
  context: string;
}
/** Autogenerated input type of CreateCheckRun */
export interface CreateCheckRunInput {
  /** Possible further actions the integrator can perform, which a user may trigger. */
  actions?: Maybe<CheckRunAction[]>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The time that the check run finished. */
  completedAt?: Maybe<DateTime>;
  /** The final conclusion of the check. */
  conclusion?: Maybe<CheckConclusionState>;
  /** The URL of the integrator's site that has the full details of the check. */
  detailsUrl?: Maybe<Uri>;
  /** A reference for the run on the integrator's system. */
  externalId?: Maybe<string>;
  /** The SHA of the head commit. */
  headSha: GitObjectId;
  /** The name of the check. */
  name: string;
  /** Descriptive details about the run. */
  output?: Maybe<CheckRunOutput>;
  /** The node ID of the repository. */
  repositoryId: string;
  /** The time that the check run began. */
  startedAt?: Maybe<DateTime>;
  /** The current status. */
  status?: Maybe<RequestableCheckStatusState>;
}
/** Possible further actions the integrator can perform. */
export interface CheckRunAction {
  /** A short explanation of what this action would do. */
  description: string;
  /** A reference for the action on the integrator's system. */
  identifier: string;
  /** The text to be displayed on a button in the web UI. */
  label: string;
}
/** Descriptive details about the check run. */
export interface CheckRunOutput {
  /** The annotations that are made as part of the check run. */
  annotations?: Maybe<CheckAnnotationData[]>;
  /** Images attached to the check run output displayed in the GitHub pull request UI. */
  images?: Maybe<CheckRunOutputImage[]>;
  /** The summary of the check run (supports Commonmark). */
  summary: string;
  /** The details of the check run (supports Commonmark). */
  text?: Maybe<string>;
  /** A title to provide for this check run. */
  title: string;
}
/** Information from a check run analysis to specific lines of code. */
export interface CheckAnnotationData {
  /** Represents an annotation's information level */
  annotationLevel: CheckAnnotationLevel;
  /** The location of the annotation */
  location: CheckAnnotationRange;
  /** A short description of the feedback for these lines of code. */
  message: string;
  /** The path of the file to add an annotation to. */
  path: string;
  /** Details about this annotation. */
  rawDetails?: Maybe<string>;
  /** The title that represents the annotation. */
  title?: Maybe<string>;
}
/** Information from a check run analysis to specific lines of code. */
export interface CheckAnnotationRange {
  /** The ending column of the range. */
  endColumn?: Maybe<number>;
  /** The ending line of the range. */
  endLine: number;
  /** The starting column of the range. */
  startColumn?: Maybe<number>;
  /** The starting line of the range. */
  startLine: number;
}
/** Images attached to the check run output displayed in the GitHub pull request UI. */
export interface CheckRunOutputImage {
  /** The alternative text for the image. */
  alt: string;
  /** A short image description. */
  caption?: Maybe<string>;
  /** The full URL of the image. */
  imageUrl: Uri;
}
/** Autogenerated input type of CreateCheckSuite */
export interface CreateCheckSuiteInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The SHA of the head commit. */
  headSha: GitObjectId;
  /** The Node ID of the repository. */
  repositoryId: string;
}
/** Autogenerated input type of CreateCommitOnBranch */
export interface CreateCommitOnBranchInput {
  /** The Ref to be updated.  Must be a branch. */
  branch: CommittableBranch;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The git commit oid expected at the head of the branch prior to the commit */
  expectedHeadOid: GitObjectId;
  /** A description of changes to files in this commit. */
  fileChanges?: Maybe<FileChanges>;
  /** The commit message the be included with the commit. */
  message: CommitMessage;
}
/** A git ref for a commit to be appended to. The ref must be a branch, i.e. its fully qualified name must start with `refs/heads/` (although the input is not required to be fully qualified). The Ref may be specified by its global node ID or by the `repositoryNameWithOwner` and `branchName`. ### Examples Specify a branch using a global node ID: { "id": "MDM6UmVmMTpyZWZzL2hlYWRzL21haW4=" } Specify a branch using `repositoryNameWithOwner` and `branchName`: { "repositoryNameWithOwner": "github/graphql-client", "branchName": "main" } */
export interface CommittableBranch {
  /** The unqualified name of the branch to append the commit to. */
  branchName?: Maybe<string>;
  /** The Node ID of the Ref to be updated. */
  id?: Maybe<string>;
  /** The nameWithOwner of the repository to commit to. */
  repositoryNameWithOwner?: Maybe<string>;
}
/** A description of a set of changes to a file tree to be made as part of a git commit, modeled as zero or more file `additions` and zero or more file `deletions`. Both fields are optional; omitting both will produce a commit with no file changes. `deletions` and `additions` describe changes to files identified by their path in the git tree using unix-style path separators, i.e. `/`.  The root of a git tree is an empty string, so paths are not slash-prefixed. `path` values must be unique across all `additions` and `deletions` provided.  Any duplication will result in a validation error. ### Encoding File contents must be provided in full for each `FileAddition`. The `contents` of a `FileAddition` must be encoded using RFC 4648 compliant base64, i.e. correct padding is required and no characters outside the standard alphabet may be used.  Invalid base64 encoding will be rejected with a validation error. The encoded contents may be binary. For text files, no assumptions are made about the character encoding of the file contents (after base64 decoding).  No charset transcoding or line-ending normalization will be performed; it is the client's responsibility to manage the character encoding of files they provide. However, for maximum compatibility we recommend using UTF-8 encoding and ensuring that all files in a repository use a consistent line-ending convention (`\n` or `\r\n`), and that all files end with a newline. ### Modeling file changes Each of the the five types of conceptual changes that can be made in a git commit can be described using the `FileChanges` type as follows: 1. New file addition: create file `hello world\n` at path `docs/README.txt`: { "additions" [ { "path": "docs/README.txt", "contents": base64encode("hello world\n") } ] } 2. Existing file modification: change existing `docs/README.txt` to have new content `new content here\n`: { "additions" [ { "path": "docs/README.txt", "contents": base64encode("new content here\n") } ] } 3. Existing file deletion: remove existing file `docs/README.txt`. Note that the path is required to exist -- specifying a path that does not exist on the given branch will abort the commit and return an error. { "deletions" [ { "path": "docs/README.txt" } ] } 4. File rename with no changes: rename `docs/README.txt` with previous content `hello world\n` to the same content at `newdocs/README.txt`: { "deletions" [ { "path": "docs/README.txt", } ], "additions" [ { "path": "newdocs/README.txt", "contents": base64encode("hello world\n") } ] } 5. File rename with changes: rename `docs/README.txt` with previous content `hello world\n` to a file at path `newdocs/README.txt` with content `new contents\n`: { "deletions" [ { "path": "docs/README.txt", } ], "additions" [ { "path": "newdocs/README.txt", "contents": base64encode("new contents\n") } ] } */
export interface FileChanges {
  /** File to add or change. */
  additions?: FileAddition[];
  /** Files to delete. */
  deletions?: FileDeletion[];
}
/** A command to add a file at the given path with the given contents as part of a commit.  Any existing file at that that path will be replaced. */
export interface FileAddition {
  /** The base64 encoded contents of the file */
  contents: Base64String;
  /** The path in the repository where the file will be located */
  path: string;
}
/** A command to delete the file at the given path as part of a commit. */
export interface FileDeletion {
  /** The path to delete */
  path: string;
}
/** A message to include with a new commit */
export interface CommitMessage {
  /** The body of the message. */
  body?: Maybe<string>;
  /** The headline of the message. */
  headline: string;
}
/** Autogenerated input type of CreateDeployment */
export interface CreateDeploymentInput {
  /** Attempt to automatically merge the default branch into the requested ref, defaults to true. */
  autoMerge?: boolean;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Short description of the deployment. */
  description?: string;
  /** Name for the target deployment environment. */
  environment?: string;
  /** JSON payload with extra information about the deployment. */
  payload?: string;
  /** The node ID of the ref to be deployed. */
  refId: string;
  /** The node ID of the repository. */
  repositoryId: string;
  /** The status contexts to verify against commit status checks. To bypass required contexts, pass an empty array. Defaults to all unique contexts. */
  requiredContexts?: Maybe<string[]>;
  /** Specifies a task to execute. */
  task?: string;
}
/** Autogenerated input type of CreateDeploymentStatus */
export interface CreateDeploymentStatusInput {
  /** Adds a new inactive status to all non-transient, non-production environment deployments with the same repository and environment name as the created status's deployment. */
  autoInactive?: boolean;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The node ID of the deployment. */
  deploymentId: string;
  /** A short description of the status. Maximum length of 140 characters. */
  description?: string;
  /** If provided, updates the environment of the deploy. Otherwise, does not modify the environment. */
  environment?: Maybe<string>;
  /** Sets the URL for accessing your environment. */
  environmentUrl?: string;
  /** The log URL to associate with this status.       This URL should contain output to keep the user updated while the task is running       or serve as historical information for what happened in the deployment. */
  logUrl?: string;
  /** The state of the deployment. */
  state: DeploymentStatusState;
}
/** Autogenerated input type of CreateDiscussion */
export interface CreateDiscussionInput {
  /** The body of the discussion. */
  body: string;
  /** The id of the discussion category to associate with this discussion. */
  categoryId: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The id of the repository on which to create the discussion. */
  repositoryId: string;
  /** The title of the discussion. */
  title: string;
}
/** Autogenerated input type of CreateEnterpriseOrganization */
export interface CreateEnterpriseOrganizationInput {
  /** The logins for the administrators of the new organization. */
  adminLogins: string[];
  /** The email used for sending billing receipts. */
  billingEmail: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise owning the new organization. */
  enterpriseId: string;
  /** The login of the new organization. */
  login: string;
  /** The profile name of the new organization. */
  profileName: string;
}
/** Autogenerated input type of CreateEnvironment */
export interface CreateEnvironmentInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The name of the environment. */
  name: string;
  /** The node ID of the repository. */
  repositoryId: string;
}
/** Autogenerated input type of CreateIpAllowListEntry */
export interface CreateIpAllowListEntryInput {
  /** An IP address or range of addresses in CIDR notation. */
  allowListValue: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Whether the IP allow list entry is active when an IP allow list is enabled. */
  isActive: boolean;
  /** An optional name for the IP allow list entry. */
  name?: Maybe<string>;
  /** The ID of the owner for which to create the new IP allow list entry. */
  ownerId: string;
}
/** Autogenerated input type of CreateIssue */
export interface CreateIssueInput {
  /** The Node ID for the user assignee for this issue. */
  assigneeIds?: Maybe<string[]>;
  /** The body for the issue description. */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The name of an issue template in the repository, assigns labels and assignees from the template to the issue */
  issueTemplate?: Maybe<string>;
  /** An array of Node IDs of labels for this issue. */
  labelIds?: Maybe<string[]>;
  /** The Node ID of the milestone for this issue. */
  milestoneId?: Maybe<string>;
  /** An array of Node IDs for projects associated with this issue. */
  projectIds?: Maybe<string[]>;
  /** The Node ID of the repository. */
  repositoryId: string;
  /** The title for the issue. */
  title: string;
}
/** Autogenerated input type of CreateLabel */
export interface CreateLabelInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** A 6 character hex code, without the leading #, identifying the color of the label. */
  color: string;
  /** A brief description of the label, such as its purpose. */
  description?: Maybe<string>;
  /** The name of the label. */
  name: string;
  /** The Node ID of the repository. */
  repositoryId: string;
}
/** Autogenerated input type of CreateLinkedBranch */
export interface CreateLinkedBranchInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the issue to link to. */
  issueId: string;
  /** The name of the new branch. Defaults to issue number and title. */
  name?: Maybe<string>;
  /** The commit SHA to base the new branch on. */
  oid: GitObjectId;
  /** ID of the repository to create the branch in. Defaults to the issue repository. */
  repositoryId?: Maybe<string>;
}
/** Autogenerated input type of CreateMigrationSource */
export interface CreateMigrationSourceInput {
  /** The migration source access token. */
  accessToken?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The GitHub personal access token of the user importing to the target repository. */
  githubPat?: Maybe<string>;
  /** The migration source name. */
  name: string;
  /** The ID of the organization that will own the migration source. */
  ownerId: string;
  /** The migration source type. */
  type: MigrationSourceType;
  /** The migration source URL, for example `https://github.com` or `https://monalisa.ghe.com`. */
  url?: Maybe<string>;
}
/** Autogenerated input type of CreateProject */
export interface CreateProjectInput {
  /** The description of project. */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The name of project. */
  name: string;
  /** The owner ID to create the project under. */
  ownerId: string;
  /** A list of repository IDs to create as linked repositories for the project */
  repositoryIds?: Maybe<string[]>;
  /** The name of the GitHub-provided template. */
  template?: Maybe<ProjectTemplate>;
}
/** Autogenerated input type of CreateProjectV2 */
export interface CreateProjectV2Input {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The owner ID to create the project under. */
  ownerId: string;
  /** The repository to link the project to. */
  repositoryId?: Maybe<string>;
  /** The team to link the project to. The team will be granted read permissions. */
  teamId?: Maybe<string>;
  /** The title of the project. */
  title: string;
}
/** Autogenerated input type of CreateProjectV2Field */
export interface CreateProjectV2FieldInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The data type of the field. */
  dataType: ProjectV2CustomFieldType;
  /** The name of the field. */
  name: string;
  /** The ID of the Project to create the field in. */
  projectId: string;
  /** Options for a single select field. At least one value is required if data_type is SINGLE_SELECT */
  singleSelectOptions?: Maybe<ProjectV2SingleSelectFieldOptionInput[]>;
}
/** Represents a single select field option */
export interface ProjectV2SingleSelectFieldOptionInput {
  /** The display color of the option */
  color: ProjectV2SingleSelectFieldOptionColor;
  /** The description text of the option */
  description: string;
  /** The name of the option */
  name: string;
}
/** Autogenerated input type of CreatePullRequest */
export interface CreatePullRequestInput {
  /** The name of the branch you want your changes pulled into. This should be an existing branch on the current repository. You cannot update the base branch on a pull request to point to another repository. */
  baseRefName: string;
  /** The contents of the pull request. */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Indicates whether this pull request should be a draft. */
  draft?: boolean;
  /** The name of the branch where your changes are implemented. For cross-repository pull requests in the same network, namespace `head_ref_name` with a user like this: `username:branch`. */
  headRefName: string;
  /** The Node ID of the head repository. */
  headRepositoryId?: Maybe<string>;
  /** Indicates whether maintainers can modify the pull request. */
  maintainerCanModify?: boolean;
  /** The Node ID of the repository. */
  repositoryId: string;
  /** The title of the pull request. */
  title: string;
}
/** Autogenerated input type of CreateRef */
export interface CreateRefInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The fully qualified name of the new Ref (ie: `refs/heads/my_new_branch`). */
  name: string;
  /** The GitObjectID that the new Ref shall target. Must point to a commit. */
  oid: GitObjectId;
  /** The Node ID of the Repository to create the Ref in. */
  repositoryId: string;
}
/** Autogenerated input type of CreateRepository */
export interface CreateRepositoryInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** A short description of the new repository. */
  description?: Maybe<string>;
  /** Indicates if the repository should have the issues feature enabled. */
  hasIssuesEnabled?: boolean;
  /** Indicates if the repository should have the wiki feature enabled. */
  hasWikiEnabled?: boolean;
  /** The URL for a web page about this repository. */
  homepageUrl?: Maybe<Uri>;
  /** The name of the new repository. */
  name: string;
  /** The ID of the owner for the new repository. */
  ownerId?: Maybe<string>;
  /** When an organization is specified as the owner, this ID identifies the team that should be granted access to the new repository. */
  teamId?: Maybe<string>;
  /** Whether this repository should be marked as a template such that anyone who can access it can create new repositories with the same files and directory structure. */
  template?: boolean;
  /** Indicates the repository's visibility level. */
  visibility: RepositoryVisibility;
}
/** Autogenerated input type of CreateRepositoryRuleset */
export interface CreateRepositoryRulesetInput {
  /** A list of Team or App IDs allowed to bypass rules in this ruleset. */
  bypassActorIds?: Maybe<string[]>;
  /** The bypass mode for this ruleset */
  bypassMode?: Maybe<RuleBypassMode>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The set of conditions for this ruleset */
  conditions: RepositoryRuleConditionsInput;
  /** The enforcement level for this ruleset */
  enforcement: RuleEnforcement;
  /** The name of the ruleset. */
  name: string;
  /** The list of rules for this ruleset */
  rules?: Maybe<RepositoryRuleInput[]>;
  /** The global relay id of the source in which a new ruleset should be created in. */
  sourceId: string;
  /** The target of the ruleset. */
  target?: Maybe<RepositoryRulesetTarget>;
}
/** Specifies the conditions required for a ruleset to evaluate */
export interface RepositoryRuleConditionsInput {
  /** Configuration for the ref_name condition */
  refName?: Maybe<RefNameConditionTargetInput>;
  /** Configuration for the repository_name condition */
  repositoryName?: Maybe<RepositoryNameConditionTargetInput>;
}
/** Parameters to be used for the ref_name condition */
export interface RefNameConditionTargetInput {
  /** Array of ref names or patterns to exclude. The condition will not pass if any of these patterns match. */
  exclude: string[];
  /** Array of ref names or patterns to include. One of these patterns must match for the condition to pass. Also accepts `~DEFAULT_BRANCH` to include the default branch or `~ALL` to include all branches. */
  include: string[];
}
/** Parameters to be used for the repository_name condition */
export interface RepositoryNameConditionTargetInput {
  /** Array of repository names or patterns to exclude. The condition will not pass if any of these patterns match. */
  exclude: string[];
  /** Array of repository names or patterns to include. One of these patterns must match for the condition to pass. Also accepts `~ALL` to include all repositories. */
  include: string[];
  /** Target changes that match these patterns will be prevented except by those with bypass permissions. */
  protected?: Maybe<boolean>;
}
/** Specifies the attributes for a new or updated rule. */
export interface RepositoryRuleInput {
  /** Optional ID of this rule when updating */
  id?: Maybe<string>;
  /** The parameters for the rule. */
  parameters?: Maybe<RuleParametersInput>;
  /** The type of rule to create. */
  type: RepositoryRuleType;
}
/** Specifies the parameters for a `RepositoryRule` object. Only one of the fields should be specified. */
export interface RuleParametersInput {
  /** Parameters used for the `branch_name_pattern` rule type */
  branchNamePattern?: Maybe<BranchNamePatternParametersInput>;
  /** Parameters used for the `commit_author_email_pattern` rule type */
  commitAuthorEmailPattern?: Maybe<CommitAuthorEmailPatternParametersInput>;
  /** Parameters used for the `commit_message_pattern` rule type */
  commitMessagePattern?: Maybe<CommitMessagePatternParametersInput>;
  /** Parameters used for the `committer_email_pattern` rule type */
  committerEmailPattern?: Maybe<CommitterEmailPatternParametersInput>;
  /** Parameters used for the `pull_request` rule type */
  pullRequest?: Maybe<PullRequestParametersInput>;
  /** Parameters used for the `required_deployments` rule type */
  requiredDeployments?: Maybe<RequiredDeploymentsParametersInput>;
  /** Parameters used for the `required_status_checks` rule type */
  requiredStatusChecks?: Maybe<RequiredStatusChecksParametersInput>;
  /** Parameters used for the `tag_name_pattern` rule type */
  tagNamePattern?: Maybe<TagNamePatternParametersInput>;
  /** Parameters used for the `update` rule type */
  update?: Maybe<UpdateParametersInput>;
}
/** Parameters to be used for the branch_name_pattern rule */
export interface BranchNamePatternParametersInput {
  /** How this rule will appear to users. */
  name?: Maybe<string>;
  /** If true, the rule will fail if the pattern matches. */
  negate?: Maybe<boolean>;
  /** The operator to use for matching. */
  operator: string;
  /** The pattern to match with. */
  pattern: string;
}
/** Parameters to be used for the commit_author_email_pattern rule */
export interface CommitAuthorEmailPatternParametersInput {
  /** How this rule will appear to users. */
  name?: Maybe<string>;
  /** If true, the rule will fail if the pattern matches. */
  negate?: Maybe<boolean>;
  /** The operator to use for matching. */
  operator: string;
  /** The pattern to match with. */
  pattern: string;
}
/** Parameters to be used for the commit_message_pattern rule */
export interface CommitMessagePatternParametersInput {
  /** How this rule will appear to users. */
  name?: Maybe<string>;
  /** If true, the rule will fail if the pattern matches. */
  negate?: Maybe<boolean>;
  /** The operator to use for matching. */
  operator: string;
  /** The pattern to match with. */
  pattern: string;
}
/** Parameters to be used for the committer_email_pattern rule */
export interface CommitterEmailPatternParametersInput {
  /** How this rule will appear to users. */
  name?: Maybe<string>;
  /** If true, the rule will fail if the pattern matches. */
  negate?: Maybe<boolean>;
  /** The operator to use for matching. */
  operator: string;
  /** The pattern to match with. */
  pattern: string;
}
/** Parameters to be used for the pull_request rule */
export interface PullRequestParametersInput {
  /** New, reviewable commits pushed will dismiss previous pull request review approvals. */
  dismissStaleReviewsOnPush: boolean;
  /** Require an approving review in pull requests that modify files that have a designated code owner. */
  requireCodeOwnerReview: boolean;
  /** The number of approving reviews that are required before a pull request can be merged. */
  requiredApprovingReviewCount: number;
  /** All conversations on code must be resolved before a pull request can be merged. */
  requiredReviewThreadResolution: boolean;
  /** Whether the most recent reviewable push must be approved by someone other than the person who pushed it. */
  requireLastPushApproval: boolean;
}
/** Parameters to be used for the required_deployments rule */
export interface RequiredDeploymentsParametersInput {
  /** The environments that must be successfully deployed to before branches can be merged. */
  requiredDeploymentEnvironments: string[];
}
/** Parameters to be used for the required_status_checks rule */
export interface RequiredStatusChecksParametersInput {
  /** Status checks that are required. */
  requiredStatusChecks: StatusCheckConfigurationInput[];
  /** Whether pull requests targeting a matching branch must be tested with the latest code. This setting will not take effect unless at least one status check is enabled. */
  strictRequiredStatusChecksPolicy: boolean;
}
/** Required status check */
export interface StatusCheckConfigurationInput {
  /** The status check context name that must be present on the commit. */
  context: string;
  /** The optional integration ID that this status check must originate from. */
  integrationId?: Maybe<number>;
}
/** Parameters to be used for the tag_name_pattern rule */
export interface TagNamePatternParametersInput {
  /** How this rule will appear to users. */
  name?: Maybe<string>;
  /** If true, the rule will fail if the pattern matches. */
  negate?: Maybe<boolean>;
  /** The operator to use for matching. */
  operator: string;
  /** The pattern to match with. */
  pattern: string;
}
/** Parameters to be used for the update rule */
export interface UpdateParametersInput {
  /** Branch can pull changes from its upstream repository */
  updateAllowsFetchAndMerge: boolean;
}
/** Autogenerated input type of CreateSponsorship */
export interface CreateSponsorshipInput {
  /** The amount to pay to the sponsorable in US dollars. Required if a tierId is not specified. Valid values: 1-12000. */
  amount?: Maybe<number>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Whether the sponsorship should happen monthly/yearly or just this one time. Required if a tierId is not specified. */
  isRecurring?: Maybe<boolean>;
  /** Specify whether others should be able to see that the sponsor is sponsoring the sponsorable. Public visibility still does not reveal which tier is used. */
  privacyLevel?: SponsorshipPrivacy;
  /** Whether the sponsor should receive email updates from the sponsorable. */
  receiveEmails?: boolean;
  /** The ID of the user or organization who is receiving the sponsorship. Required if sponsorableLogin is not given. */
  sponsorableId?: Maybe<string>;
  /** The username of the user or organization who is receiving the sponsorship. Required if sponsorableId is not given. */
  sponsorableLogin?: Maybe<string>;
  /** The ID of the user or organization who is acting as the sponsor, paying for the sponsorship. Required if sponsorLogin is not given. */
  sponsorId?: Maybe<string>;
  /** The username of the user or organization who is acting as the sponsor, paying for the sponsorship. Required if sponsorId is not given. */
  sponsorLogin?: Maybe<string>;
  /** The ID of one of sponsorable's existing tiers to sponsor at. Required if amount is not specified. */
  tierId?: Maybe<string>;
}
/** Autogenerated input type of CreateSponsorships */
export interface CreateSponsorshipsInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Specify whether others should be able to see that the sponsor is sponsoring the sponsorables. Public visibility still does not reveal the dollar value of the sponsorship. */
  privacyLevel?: SponsorshipPrivacy;
  /** Whether the sponsor should receive email updates from the sponsorables. */
  receiveEmails?: boolean;
  /** The username of the user or organization who is acting as the sponsor, paying for the sponsorships. */
  sponsorLogin: string;
  /** The list of maintainers to sponsor and for how much apiece. */
  sponsorships: BulkSponsorship[];
}
/** Information about a sponsorship to make for a user or organization with a GitHub Sponsors profile, as part of sponsoring many users or organizations at once. */
export interface BulkSponsorship {
  /** The amount to pay to the sponsorable in US dollars. Valid values: 1-12000. */
  amount: number;
  /** The ID of the user or organization who is receiving the sponsorship. Required if sponsorableLogin is not given. */
  sponsorableId?: Maybe<string>;
  /** The username of the user or organization who is receiving the sponsorship. Required if sponsorableId is not given. */
  sponsorableLogin?: Maybe<string>;
}
/** Autogenerated input type of CreateSponsorsListing */
export interface CreateSponsorsListingInput {
  /** The country or region where the sponsorable's bank account is located. Required if fiscalHostLogin is not specified, ignored when fiscalHostLogin is specified. */
  billingCountryOrRegionCode?: Maybe<SponsorsCountryOrRegionCode>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The email address we should use to contact you about the GitHub Sponsors profile being created. This will not be shared publicly. Must be a verified email address already on your GitHub account. Only relevant when the sponsorable is yourself. Defaults to your primary email address on file if omitted. */
  contactEmail?: Maybe<string>;
  /** The username of the supported fiscal host's GitHub organization, if you want to receive sponsorship payouts through a fiscal host rather than directly to a bank account. For example, 'Open-Source-Collective' for Open Source Collective or 'numfocus' for numFOCUS. Case insensitive. See https://docs.github.com/sponsors/receiving-sponsorships-through-github-sponsors/using-a-fiscal-host-to-receive-github-sponsors-payouts for more information. */
  fiscalHostLogin?: Maybe<string>;
  /** The URL for your profile page on the fiscal host's website, e.g., https://opencollective.com/babel or https://numfocus.org/project/bokeh. Required if fiscalHostLogin is specified. */
  fiscallyHostedProjectProfileUrl?: Maybe<string>;
  /** Provide an introduction to serve as the main focus that appears on your GitHub Sponsors profile. It's a great opportunity to help potential sponsors learn more about you, your work, and why their sponsorship is important to you. GitHub-flavored Markdown is supported. */
  fullDescription?: Maybe<string>;
  /** The country or region where the sponsorable resides. This is for tax purposes. Required if the sponsorable is yourself, ignored when sponsorableLogin specifies an organization. */
  residenceCountryOrRegionCode?: Maybe<SponsorsCountryOrRegionCode>;
  /** The username of the organization to create a GitHub Sponsors profile for, if desired. Defaults to creating a GitHub Sponsors profile for the authenticated user if omitted. */
  sponsorableLogin?: Maybe<string>;
}
/** Autogenerated input type of CreateSponsorsTier */
export interface CreateSponsorsTierInput {
  /** The value of the new tier in US dollars. Valid values: 1-12000. */
  amount: number;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** A description of what this tier is, what perks sponsors might receive, what a sponsorship at this tier means for you, etc. */
  description: string;
  /** Whether sponsorships using this tier should happen monthly/yearly or just once. */
  isRecurring?: boolean;
  /** Whether to make the tier available immediately for sponsors to choose. Defaults to creating a draft tier that will not be publicly visible. */
  publish?: boolean;
  /** Optional ID of the private repository that sponsors at this tier should gain read-only access to. Must be owned by an organization. */
  repositoryId?: Maybe<string>;
  /** Optional name of the private repository that sponsors at this tier should gain read-only access to. Must be owned by an organization. Necessary if repositoryOwnerLogin is given. Will be ignored if repositoryId is given. */
  repositoryName?: Maybe<string>;
  /** Optional login of the organization owner of the private repository that sponsors at this tier should gain read-only access to. Necessary if repositoryName is given. Will be ignored if repositoryId is given. */
  repositoryOwnerLogin?: Maybe<string>;
  /** The ID of the user or organization who owns the GitHub Sponsors profile. Defaults to the current user if omitted and sponsorableLogin is not given. */
  sponsorableId?: Maybe<string>;
  /** The username of the user or organization who owns the GitHub Sponsors profile. Defaults to the current user if omitted and sponsorableId is not given. */
  sponsorableLogin?: Maybe<string>;
  /** Optional message new sponsors at this tier will receive. */
  welcomeMessage?: Maybe<string>;
}
/** Autogenerated input type of CreateTeamDiscussion */
export interface CreateTeamDiscussionInput {
  /** The content of the discussion. */
  body: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** If true, restricts the visibility of this discussion to team members and organization admins. If false or not specified, allows any organization member to view this discussion. */
  private?: Maybe<boolean>;
  /** The ID of the team to which the discussion belongs. */
  teamId: string;
  /** The title of the discussion. */
  title: string;
}
/** Autogenerated input type of CreateTeamDiscussionComment */
export interface CreateTeamDiscussionCommentInput {
  /** The content of the comment. */
  body: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the discussion to which the comment belongs. */
  discussionId: string;
}
/** Autogenerated input type of DeclineTopicSuggestion */
export interface DeclineTopicSuggestionInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The name of the suggested topic. */
  name: string;
  /** The reason why the suggested topic is declined. */
  reason: TopicSuggestionDeclineReason;
  /** The Node ID of the repository. */
  repositoryId: string;
}
/** Autogenerated input type of DeleteBranchProtectionRule */
export interface DeleteBranchProtectionRuleInput {
  /** The global relay id of the branch protection rule to be deleted. */
  branchProtectionRuleId: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
}
/** Autogenerated input type of DeleteDeployment */
export interface DeleteDeploymentInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the deployment to be deleted. */
  id: string;
}
/** Autogenerated input type of DeleteDiscussion */
export interface DeleteDiscussionInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The id of the discussion to delete. */
  id: string;
}
/** Autogenerated input type of DeleteDiscussionComment */
export interface DeleteDiscussionCommentInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node id of the discussion comment to delete. */
  id: string;
}
/** Autogenerated input type of DeleteEnvironment */
export interface DeleteEnvironmentInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the environment to be deleted. */
  id: string;
}
/** Autogenerated input type of DeleteIpAllowListEntry */
export interface DeleteIpAllowListEntryInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the IP allow list entry to delete. */
  ipAllowListEntryId: string;
}
/** Autogenerated input type of DeleteIssue */
export interface DeleteIssueInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the issue to delete. */
  issueId: string;
}
/** Autogenerated input type of DeleteIssueComment */
export interface DeleteIssueCommentInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the comment to delete. */
  id: string;
}
/** Autogenerated input type of DeleteLabel */
export interface DeleteLabelInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the label to be deleted. */
  id: string;
}
/** Autogenerated input type of DeleteLinkedBranch */
export interface DeleteLinkedBranchInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the linked branch */
  linkedBranchId: string;
}
/** Autogenerated input type of DeletePackageVersion */
export interface DeletePackageVersionInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the package version to be deleted. */
  packageVersionId: string;
}
/** Autogenerated input type of DeleteProject */
export interface DeleteProjectInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Project ID to update. */
  projectId: string;
}
/** Autogenerated input type of DeleteProjectCard */
export interface DeleteProjectCardInput {
  /** The id of the card to delete. */
  cardId: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
}
/** Autogenerated input type of DeleteProjectColumn */
export interface DeleteProjectColumnInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The id of the column to delete. */
  columnId: string;
}
/** Autogenerated input type of DeleteProjectV2 */
export interface DeleteProjectV2Input {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the Project to delete. */
  projectId: string;
}
/** Autogenerated input type of DeleteProjectV2Field */
export interface DeleteProjectV2FieldInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the field to delete. */
  fieldId: string;
}
/** Autogenerated input type of DeleteProjectV2Item */
export interface DeleteProjectV2ItemInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the item to be removed. */
  itemId: string;
  /** The ID of the Project from which the item should be removed. */
  projectId: string;
}
/** Autogenerated input type of DeleteProjectV2Workflow */
export interface DeleteProjectV2WorkflowInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the workflow to be removed. */
  workflowId: string;
}
/** Autogenerated input type of DeletePullRequestReview */
export interface DeletePullRequestReviewInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the pull request review to delete. */
  pullRequestReviewId: string;
}
/** Autogenerated input type of DeletePullRequestReviewComment */
export interface DeletePullRequestReviewCommentInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the comment to delete. */
  id: string;
}
/** Autogenerated input type of DeleteRef */
export interface DeleteRefInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the Ref to be deleted. */
  refId: string;
}
/** Autogenerated input type of DeleteRepositoryRuleset */
export interface DeleteRepositoryRulesetInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The global relay id of the repository ruleset to be deleted. */
  repositoryRulesetId: string;
}
/** Autogenerated input type of DeleteTeamDiscussion */
export interface DeleteTeamDiscussionInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The discussion ID to delete. */
  id: string;
}
/** Autogenerated input type of DeleteTeamDiscussionComment */
export interface DeleteTeamDiscussionCommentInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the comment to delete. */
  id: string;
}
/** Autogenerated input type of DeleteVerifiableDomain */
export interface DeleteVerifiableDomainInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the verifiable domain to delete. */
  id: string;
}
/** Autogenerated input type of DequeuePullRequest */
export interface DequeuePullRequestInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the pull request to be dequeued. */
  id: string;
}
/** Autogenerated input type of DisablePullRequestAutoMerge */
export interface DisablePullRequestAutoMergeInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the pull request to disable auto merge on. */
  pullRequestId: string;
}
/** Autogenerated input type of DismissPullRequestReview */
export interface DismissPullRequestReviewInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The contents of the pull request review dismissal message. */
  message: string;
  /** The Node ID of the pull request review to modify. */
  pullRequestReviewId: string;
}
/** Autogenerated input type of DismissRepositoryVulnerabilityAlert */
export interface DismissRepositoryVulnerabilityAlertInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The reason the Dependabot alert is being dismissed. */
  dismissReason: DismissReason;
  /** The Dependabot alert ID to dismiss. */
  repositoryVulnerabilityAlertId: string;
}
/** Autogenerated input type of EnablePullRequestAutoMerge */
export interface EnablePullRequestAutoMergeInput {
  /** The email address to associate with this merge. */
  authorEmail?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Commit body to use for the commit when the PR is mergable; if omitted, a default message will be used. NOTE: when merging with a merge queue any input value for commit message is ignored. */
  commitBody?: Maybe<string>;
  /** Commit headline to use for the commit when the PR is mergable; if omitted, a default message will be used. NOTE: when merging with a merge queue any input value for commit headline is ignored. */
  commitHeadline?: Maybe<string>;
  /** The expected head OID of the pull request. */
  expectedHeadOid?: Maybe<GitObjectId>;
  /** The merge method to use. If omitted, defaults to `MERGE`. NOTE: when merging with a merge queue any input value for merge method is ignored. */
  mergeMethod?: PullRequestMergeMethod;
  /** ID of the pull request to enable auto-merge on. */
  pullRequestId: string;
}
/** Autogenerated input type of EnqueuePullRequest */
export interface EnqueuePullRequestInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The expected head OID of the pull request. */
  expectedHeadOid?: Maybe<GitObjectId>;
  /** Add the pull request to the front of the queue. */
  jump?: Maybe<boolean>;
  /** The ID of the pull request to enqueue. */
  pullRequestId: string;
}
/** Autogenerated input type of FollowOrganization */
export interface FollowOrganizationInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the organization to follow. */
  organizationId: string;
}
/** Autogenerated input type of FollowUser */
export interface FollowUserInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the user to follow. */
  userId: string;
}
/** Autogenerated input type of GrantEnterpriseOrganizationsMigratorRole */
export interface GrantEnterpriseOrganizationsMigratorRoleInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise to which all organizations managed by it will be granted the migrator role. */
  enterpriseId: string;
  /** The login of the user to grant the migrator role */
  login: string;
}
/** Autogenerated input type of GrantMigratorRole */
export interface GrantMigratorRoleInput {
  /** The user login or Team slug to grant the migrator role. */
  actor: string;
  /** Specifies the type of the actor, can be either USER or TEAM. */
  actorType: ActorType;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the organization that the user/team belongs to. */
  organizationId: string;
}
/** Autogenerated input type of ImportProject */
export interface ImportProjectInput {
  /** The description of Project. */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** A list of columns containing issues and pull requests. */
  columnImports: ProjectColumnImport[];
  /** The name of Project. */
  name: string;
  /** The name of the Organization or User to create the Project under. */
  ownerName: string;
  /** Whether the Project is public or not. */
  public?: boolean;
}
/** A project column and a list of its issues and PRs. */
export interface ProjectColumnImport {
  /** The name of the column. */
  columnName: string;
  /** A list of issues and pull requests in the column. */
  issues?: Maybe<ProjectCardImport[]>;
  /** The position of the column, starting from 0. */
  position: number;
}
/** An issue or PR and its owning repository to be used in a project card. */
export interface ProjectCardImport {
  /** The issue or pull request number. */
  number: number;
  /** Repository name with owner (owner/repository). */
  repository: string;
}
/** Autogenerated input type of InviteEnterpriseAdmin */
export interface InviteEnterpriseAdminInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The email of the person to invite as an administrator. */
  email?: Maybe<string>;
  /** The ID of the enterprise to which you want to invite an administrator. */
  enterpriseId: string;
  /** The login of a user to invite as an administrator. */
  invitee?: Maybe<string>;
  /** The role of the administrator. */
  role?: Maybe<EnterpriseAdministratorRole>;
}
/** Autogenerated input type of LinkProjectV2ToRepository */
export interface LinkProjectV2ToRepositoryInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the project to link to the repository. */
  projectId: string;
  /** The ID of the repository to link to the project. */
  repositoryId: string;
}
/** Autogenerated input type of LinkProjectV2ToTeam */
export interface LinkProjectV2ToTeamInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the project to link to the team. */
  projectId: string;
  /** The ID of the team to link to the project. */
  teamId: string;
}
/** Autogenerated input type of LinkRepositoryToProject */
export interface LinkRepositoryToProjectInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the Project to link to a Repository */
  projectId: string;
  /** The ID of the Repository to link to a Project. */
  repositoryId: string;
}
/** Autogenerated input type of LockLockable */
export interface LockLockableInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the item to be locked. */
  lockableId: string;
  /** A reason for why the item will be locked. */
  lockReason?: Maybe<LockReason>;
}
/** Autogenerated input type of MarkDiscussionCommentAsAnswer */
export interface MarkDiscussionCommentAsAnswerInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the discussion comment to mark as an answer. */
  id: string;
}
/** Autogenerated input type of MarkFileAsViewed */
export interface MarkFileAsViewedInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The path of the file to mark as viewed */
  path: string;
  /** The Node ID of the pull request. */
  pullRequestId: string;
}
/** Autogenerated input type of MarkPullRequestReadyForReview */
export interface MarkPullRequestReadyForReviewInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the pull request to be marked as ready for review. */
  pullRequestId: string;
}
/** Autogenerated input type of MergeBranch */
export interface MergeBranchInput {
  /** The email address to associate with this commit. */
  authorEmail?: Maybe<string>;
  /** The name of the base branch that the provided head will be merged into. */
  base: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Message to use for the merge commit. If omitted, a default will be used. */
  commitMessage?: Maybe<string>;
  /** The head to merge into the base branch. This can be a branch name or a commit GitObjectID. */
  head: string;
  /** The Node ID of the Repository containing the base branch that will be modified. */
  repositoryId: string;
}
/** Autogenerated input type of MergePullRequest */
export interface MergePullRequestInput {
  /** The email address to associate with this merge. */
  authorEmail?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Commit body to use for the merge commit; if omitted, a default message will be used */
  commitBody?: Maybe<string>;
  /** Commit headline to use for the merge commit; if omitted, a default message will be used. */
  commitHeadline?: Maybe<string>;
  /** OID that the pull request head ref must match to allow merge; if omitted, no check is performed. */
  expectedHeadOid?: Maybe<GitObjectId>;
  /** The merge method to use. If omitted, defaults to 'MERGE' */
  mergeMethod?: PullRequestMergeMethod;
  /** ID of the pull request to be merged. */
  pullRequestId: string;
}
/** Autogenerated input type of MinimizeComment */
export interface MinimizeCommentInput {
  /** The classification of comment */
  classifier: ReportedContentClassifiers;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the subject to modify. */
  subjectId: string;
}
/** Autogenerated input type of MoveProjectCard */
export interface MoveProjectCardInput {
  /** Place the new card after the card with this id. Pass null to place it at the top. */
  afterCardId?: Maybe<string>;
  /** The id of the card to move. */
  cardId: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The id of the column to move it into. */
  columnId: string;
}
/** Autogenerated input type of MoveProjectColumn */
export interface MoveProjectColumnInput {
  /** Place the new column after the column with this id. Pass null to place it at the front. */
  afterColumnId?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The id of the column to move. */
  columnId: string;
}
/** Autogenerated input type of PinIssue */
export interface PinIssueInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the issue to be pinned */
  issueId: string;
}
/** Autogenerated input type of PublishSponsorsTier */
export interface PublishSponsorsTierInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the draft tier to publish. */
  tierId: string;
}
/** Autogenerated input type of RegenerateEnterpriseIdentityProviderRecoveryCodes */
export interface RegenerateEnterpriseIdentityProviderRecoveryCodesInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set an identity provider. */
  enterpriseId: string;
}
/** Autogenerated input type of RegenerateVerifiableDomainToken */
export interface RegenerateVerifiableDomainTokenInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the verifiable domain to regenerate the verification token of. */
  id: string;
}
/** Autogenerated input type of RejectDeployments */
export interface RejectDeploymentsInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Optional comment for rejecting deployments */
  comment?: string;
  /** The ids of environments to reject deployments */
  environmentIds: string[];
  /** The node ID of the workflow run containing the pending deployments. */
  workflowRunId: string;
}
/** Autogenerated input type of RemoveAssigneesFromAssignable */
export interface RemoveAssigneesFromAssignableInput {
  /** The id of the assignable object to remove assignees from. */
  assignableId: string;
  /** The id of users to remove as assignees. */
  assigneeIds: string[];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
}
/** Autogenerated input type of RemoveEnterpriseAdmin */
export interface RemoveEnterpriseAdminInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Enterprise ID from which to remove the administrator. */
  enterpriseId: string;
  /** The login of the user to remove as an administrator. */
  login: string;
}
/** Autogenerated input type of RemoveEnterpriseIdentityProvider */
export interface RemoveEnterpriseIdentityProviderInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise from which to remove the identity provider. */
  enterpriseId: string;
}
/** Autogenerated input type of RemoveEnterpriseMember */
export interface RemoveEnterpriseMemberInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise from which the user should be removed. */
  enterpriseId: string;
  /** The ID of the user to remove from the enterprise. */
  userId: string;
}
/** Autogenerated input type of RemoveEnterpriseOrganization */
export interface RemoveEnterpriseOrganizationInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise from which the organization should be removed. */
  enterpriseId: string;
  /** The ID of the organization to remove from the enterprise. */
  organizationId: string;
}
/** Autogenerated input type of RemoveEnterpriseSupportEntitlement */
export interface RemoveEnterpriseSupportEntitlementInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the Enterprise which the admin belongs to. */
  enterpriseId: string;
  /** The login of a member who will lose the support entitlement. */
  login: string;
}
/** Autogenerated input type of RemoveLabelsFromLabelable */
export interface RemoveLabelsFromLabelableInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The id of the Labelable to remove labels from. */
  labelableId: string;
  /** The ids of labels to remove. */
  labelIds: string[];
}
/** Autogenerated input type of RemoveOutsideCollaborator */
export interface RemoveOutsideCollaboratorInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the organization to remove the outside collaborator from. */
  organizationId: string;
  /** The ID of the outside collaborator to remove. */
  userId: string;
}
/** Autogenerated input type of RemoveReaction */
export interface RemoveReactionInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The name of the emoji reaction to remove. */
  content: ReactionContent;
  /** The Node ID of the subject to modify. */
  subjectId: string;
}
/** Autogenerated input type of RemoveStar */
export interface RemoveStarInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Starrable ID to unstar. */
  starrableId: string;
}
/** Autogenerated input type of RemoveUpvote */
export interface RemoveUpvoteInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the discussion or comment to remove upvote. */
  subjectId: string;
}
/** Autogenerated input type of ReopenDiscussion */
export interface ReopenDiscussionInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the discussion to be reopened. */
  discussionId: string;
}
/** Autogenerated input type of ReopenIssue */
export interface ReopenIssueInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the issue to be opened. */
  issueId: string;
}
/** Autogenerated input type of ReopenPullRequest */
export interface ReopenPullRequestInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the pull request to be reopened. */
  pullRequestId: string;
}
/** Autogenerated input type of RequestReviews */
export interface RequestReviewsInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the pull request to modify. */
  pullRequestId: string;
  /** The Node IDs of the team to request. */
  teamIds?: Maybe<string[]>;
  /** Add users to the set rather than replace. */
  union?: boolean;
  /** The Node IDs of the user to request. */
  userIds?: Maybe<string[]>;
}
/** Autogenerated input type of RerequestCheckSuite */
export interface RerequestCheckSuiteInput {
  /** The Node ID of the check suite. */
  checkSuiteId: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the repository. */
  repositoryId: string;
}
/** Autogenerated input type of ResolveReviewThread */
export interface ResolveReviewThreadInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the thread to resolve */
  threadId: string;
}
/** Autogenerated input type of RetireSponsorsTier */
export interface RetireSponsorsTierInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the published tier to retire. */
  tierId: string;
}
/** Autogenerated input type of RevertPullRequest */
export interface RevertPullRequestInput {
  /** The description of the revert pull request. */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Indicates whether the revert pull request should be a draft. */
  draft?: boolean;
  /** The ID of the pull request to revert. */
  pullRequestId: string;
  /** The title of the revert pull request. */
  title?: Maybe<string>;
}
/** Autogenerated input type of RevokeEnterpriseOrganizationsMigratorRole */
export interface RevokeEnterpriseOrganizationsMigratorRoleInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise to which all organizations managed by it will be granted the migrator role. */
  enterpriseId: string;
  /** The login of the user to revoke the migrator role */
  login: string;
}
/** Autogenerated input type of RevokeMigratorRole */
export interface RevokeMigratorRoleInput {
  /** The user login or Team slug to revoke the migrator role from. */
  actor: string;
  /** Specifies the type of the actor, can be either USER or TEAM. */
  actorType: ActorType;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the organization that the user/team belongs to. */
  organizationId: string;
}
/** Autogenerated input type of SetEnterpriseIdentityProvider */
export interface SetEnterpriseIdentityProviderInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The digest algorithm used to sign SAML requests for the identity provider. */
  digestMethod: SamlDigestAlgorithm;
  /** The ID of the enterprise on which to set an identity provider. */
  enterpriseId: string;
  /** The x509 certificate used by the identity provider to sign assertions and responses. */
  idpCertificate: string;
  /** The Issuer Entity ID for the SAML identity provider */
  issuer?: Maybe<string>;
  /** The signature algorithm used to sign SAML requests for the identity provider. */
  signatureMethod: SamlSignatureAlgorithm;
  /** The URL endpoint for the identity provider's SAML SSO. */
  ssoUrl: Uri;
}
/** Autogenerated input type of SetOrganizationInteractionLimit */
export interface SetOrganizationInteractionLimitInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** When this limit should expire. */
  expiry?: Maybe<RepositoryInteractionLimitExpiry>;
  /** The limit to set. */
  limit: RepositoryInteractionLimit;
  /** The ID of the organization to set a limit for. */
  organizationId: string;
}
/** Autogenerated input type of SetRepositoryInteractionLimit */
export interface SetRepositoryInteractionLimitInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** When this limit should expire. */
  expiry?: Maybe<RepositoryInteractionLimitExpiry>;
  /** The limit to set. */
  limit: RepositoryInteractionLimit;
  /** The ID of the repository to set a limit for. */
  repositoryId: string;
}
/** Autogenerated input type of SetUserInteractionLimit */
export interface SetUserInteractionLimitInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** When this limit should expire. */
  expiry?: Maybe<RepositoryInteractionLimitExpiry>;
  /** The limit to set. */
  limit: RepositoryInteractionLimit;
  /** The ID of the user to set a limit for. */
  userId: string;
}
/** Autogenerated input type of StartOrganizationMigration */
export interface StartOrganizationMigrationInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The migration source access token. */
  sourceAccessToken: string;
  /** The URL of the organization to migrate. */
  sourceOrgUrl: Uri;
  /** The ID of the enterprise the target organization belongs to. */
  targetEnterpriseId: string;
  /** The name of the target organization. */
  targetOrgName: string;
}
/** Autogenerated input type of StartRepositoryMigration */
export interface StartRepositoryMigrationInput {
  /** The migration source access token. */
  accessToken?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Whether to continue the migration on error. Defaults to `false`. */
  continueOnError?: Maybe<boolean>;
  /** The signed URL to access the user-uploaded git archive. */
  gitArchiveUrl?: Maybe<string>;
  /** The GitHub personal access token of the user importing to the target repository. */
  githubPat?: Maybe<string>;
  /** Whether to lock the source repository. */
  lockSource?: Maybe<boolean>;
  /** The signed URL to access the user-uploaded metadata archive. */
  metadataArchiveUrl?: Maybe<string>;
  /** The ID of the organization that will own the imported repository. */
  ownerId: string;
  /** The name of the imported repository. */
  repositoryName: string;
  /** Whether to skip migrating releases for the repository. */
  skipReleases?: Maybe<boolean>;
  /** The ID of the migration source. */
  sourceId: string;
  /** The URL of the source repository. */
  sourceRepositoryUrl?: Maybe<Uri>;
  /** The visibility of the imported repository. */
  targetRepoVisibility?: Maybe<string>;
}
/** Autogenerated input type of SubmitPullRequestReview */
export interface SubmitPullRequestReviewInput {
  /** The text field to set on the Pull Request Review. */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The event to send to the Pull Request Review. */
  event: PullRequestReviewEvent;
  /** The Pull Request ID to submit any pending reviews. */
  pullRequestId?: Maybe<string>;
  /** The Pull Request Review ID to submit. */
  pullRequestReviewId?: Maybe<string>;
}
/** Autogenerated input type of TransferEnterpriseOrganization */
export interface TransferEnterpriseOrganizationInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise where the organization should be transferred. */
  destinationEnterpriseId: string;
  /** The ID of the organization to transfer. */
  organizationId: string;
}
/** Autogenerated input type of TransferIssue */
export interface TransferIssueInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Whether to create labels if they don't exist in the target repository (matched by name) */
  createLabelsIfMissing?: boolean;
  /** The Node ID of the issue to be transferred */
  issueId: string;
  /** The Node ID of the repository the issue should be transferred to */
  repositoryId: string;
}
/** Autogenerated input type of UnarchiveProjectV2Item */
export interface UnarchiveProjectV2ItemInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the ProjectV2Item to unarchive. */
  itemId: string;
  /** The ID of the Project to archive the item from. */
  projectId: string;
}
/** Autogenerated input type of UnarchiveRepository */
export interface UnarchiveRepositoryInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the repository to unarchive. */
  repositoryId: string;
}
/** Autogenerated input type of UnfollowOrganization */
export interface UnfollowOrganizationInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the organization to unfollow. */
  organizationId: string;
}
/** Autogenerated input type of UnfollowUser */
export interface UnfollowUserInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the user to unfollow. */
  userId: string;
}
/** Autogenerated input type of UnlinkProjectV2FromRepository */
export interface UnlinkProjectV2FromRepositoryInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the project to unlink from the repository. */
  projectId: string;
  /** The ID of the repository to unlink from the project. */
  repositoryId: string;
}
/** Autogenerated input type of UnlinkProjectV2FromTeam */
export interface UnlinkProjectV2FromTeamInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the project to unlink from the team. */
  projectId: string;
  /** The ID of the team to unlink from the project. */
  teamId: string;
}
/** Autogenerated input type of UnlinkRepositoryFromProject */
export interface UnlinkRepositoryFromProjectInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the Project linked to the Repository. */
  projectId: string;
  /** The ID of the Repository linked to the Project. */
  repositoryId: string;
}
/** Autogenerated input type of UnlockLockable */
export interface UnlockLockableInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the item to be unlocked. */
  lockableId: string;
}
/** Autogenerated input type of UnmarkDiscussionCommentAsAnswer */
export interface UnmarkDiscussionCommentAsAnswerInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the discussion comment to unmark as an answer. */
  id: string;
}
/** Autogenerated input type of UnmarkFileAsViewed */
export interface UnmarkFileAsViewedInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The path of the file to mark as unviewed */
  path: string;
  /** The Node ID of the pull request. */
  pullRequestId: string;
}
/** Autogenerated input type of UnmarkIssueAsDuplicate */
export interface UnmarkIssueAsDuplicateInput {
  /** ID of the issue or pull request currently considered canonical/authoritative/original. */
  canonicalId: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** ID of the issue or pull request currently marked as a duplicate. */
  duplicateId: string;
}
/** Autogenerated input type of UnminimizeComment */
export interface UnminimizeCommentInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the subject to modify. */
  subjectId: string;
}
/** Autogenerated input type of UnpinIssue */
export interface UnpinIssueInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the issue to be unpinned */
  issueId: string;
}
/** Autogenerated input type of UnresolveReviewThread */
export interface UnresolveReviewThreadInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the thread to unresolve */
  threadId: string;
}
/** Autogenerated input type of UpdateBranchProtectionRule */
export interface UpdateBranchProtectionRuleInput {
  /** Can this branch be deleted. */
  allowsDeletions?: Maybe<boolean>;
  /** Are force pushes allowed on this branch. */
  allowsForcePushes?: Maybe<boolean>;
  /** Is branch creation a protected operation. */
  blocksCreations?: Maybe<boolean>;
  /** The global relay id of the branch protection rule to be updated. */
  branchProtectionRuleId: string;
  /** A list of User, Team, or App IDs allowed to bypass force push targeting matching branches. */
  bypassForcePushActorIds?: Maybe<string[]>;
  /** A list of User, Team, or App IDs allowed to bypass pull requests targeting matching branches. */
  bypassPullRequestActorIds?: Maybe<string[]>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Will new commits pushed to matching branches dismiss pull request review approvals. */
  dismissesStaleReviews?: Maybe<boolean>;
  /** Can admins overwrite branch protection. */
  isAdminEnforced?: Maybe<boolean>;
  /** Whether users can pull changes from upstream when the branch is locked. Set to `true` to allow fork syncing. Set to `false` to prevent fork syncing. */
  lockAllowsFetchAndMerge?: Maybe<boolean>;
  /** Whether to set the branch as read-only. If this is true, users will not be able to push to the branch. */
  lockBranch?: Maybe<boolean>;
  /** The glob-like pattern used to determine matching branches. */
  pattern?: Maybe<string>;
  /** A list of User, Team, or App IDs allowed to push to matching branches. */
  pushActorIds?: Maybe<string[]>;
  /** Number of approving reviews required to update matching branches. */
  requiredApprovingReviewCount?: Maybe<number>;
  /** The list of required deployment environments */
  requiredDeploymentEnvironments?: Maybe<string[]>;
  /** List of required status check contexts that must pass for commits to be accepted to matching branches. */
  requiredStatusCheckContexts?: Maybe<string[]>;
  /** The list of required status checks */
  requiredStatusChecks?: Maybe<RequiredStatusCheckInput[]>;
  /** Whether the most recent push must be approved by someone other than the person who pushed it */
  requireLastPushApproval?: Maybe<boolean>;
  /** Are approving reviews required to update matching branches. */
  requiresApprovingReviews?: Maybe<boolean>;
  /** Are reviews from code owners required to update matching branches. */
  requiresCodeOwnerReviews?: Maybe<boolean>;
  /** Are commits required to be signed. */
  requiresCommitSignatures?: Maybe<boolean>;
  /** Are conversations required to be resolved before merging. */
  requiresConversationResolution?: Maybe<boolean>;
  /** Are successful deployments required before merging. */
  requiresDeployments?: Maybe<boolean>;
  /** Are merge commits prohibited from being pushed to this branch. */
  requiresLinearHistory?: Maybe<boolean>;
  /** Are status checks required to update matching branches. */
  requiresStatusChecks?: Maybe<boolean>;
  /** Are branches required to be up to date before merging. */
  requiresStrictStatusChecks?: Maybe<boolean>;
  /** Is pushing to matching branches restricted. */
  restrictsPushes?: Maybe<boolean>;
  /** Is dismissal of pull request reviews restricted. */
  restrictsReviewDismissals?: Maybe<boolean>;
  /** A list of User, Team, or App IDs allowed to dismiss reviews on pull requests targeting matching branches. */
  reviewDismissalActorIds?: Maybe<string[]>;
}
/** Autogenerated input type of UpdateCheckRun */
export interface UpdateCheckRunInput {
  /** Possible further actions the integrator can perform, which a user may trigger. */
  actions?: Maybe<CheckRunAction[]>;
  /** The node of the check. */
  checkRunId: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The time that the check run finished. */
  completedAt?: Maybe<DateTime>;
  /** The final conclusion of the check. */
  conclusion?: Maybe<CheckConclusionState>;
  /** The URL of the integrator's site that has the full details of the check. */
  detailsUrl?: Maybe<Uri>;
  /** A reference for the run on the integrator's system. */
  externalId?: Maybe<string>;
  /** The name of the check. */
  name?: Maybe<string>;
  /** Descriptive details about the run. */
  output?: Maybe<CheckRunOutput>;
  /** The node ID of the repository. */
  repositoryId: string;
  /** The time that the check run began. */
  startedAt?: Maybe<DateTime>;
  /** The current status. */
  status?: Maybe<RequestableCheckStatusState>;
}
/** Autogenerated input type of UpdateCheckSuitePreferences */
export interface UpdateCheckSuitePreferencesInput {
  /** The check suite preferences to modify. */
  autoTriggerPreferences: CheckSuiteAutoTriggerPreference[];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the repository. */
  repositoryId: string;
}
/** The auto-trigger preferences that are available for check suites. */
export interface CheckSuiteAutoTriggerPreference {
  /** The node ID of the application that owns the check suite. */
  appId: string;
  /** Set to `true` to enable automatic creation of CheckSuite events upon pushes to the repository. */
  setting: boolean;
}
/** Autogenerated input type of UpdateDiscussion */
export interface UpdateDiscussionInput {
  /** The new contents of the discussion body. */
  body?: Maybe<string>;
  /** The Node ID of a discussion category within the same repository to change this discussion to. */
  categoryId?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the discussion to update. */
  discussionId: string;
  /** The new discussion title. */
  title?: Maybe<string>;
}
/** Autogenerated input type of UpdateDiscussionComment */
export interface UpdateDiscussionCommentInput {
  /** The new contents of the comment body. */
  body: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the discussion comment to update. */
  commentId: string;
}
/** Autogenerated input type of UpdateEnterpriseAdministratorRole */
export interface UpdateEnterpriseAdministratorRoleInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the Enterprise which the admin belongs to. */
  enterpriseId: string;
  /** The login of a administrator whose role is being changed. */
  login: string;
  /** The new role for the Enterprise administrator. */
  role: EnterpriseAdministratorRole;
}
/** Autogenerated input type of UpdateEnterpriseAllowPrivateRepositoryForkingSetting */
export interface UpdateEnterpriseAllowPrivateRepositoryForkingSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set the allow private repository forking setting. */
  enterpriseId: string;
  /** The value for the allow private repository forking policy on the enterprise. */
  policyValue?: Maybe<EnterpriseAllowPrivateRepositoryForkingPolicyValue>;
  /** The value for the allow private repository forking setting on the enterprise. */
  settingValue: EnterpriseEnabledDisabledSettingValue;
}
/** Autogenerated input type of UpdateEnterpriseDefaultRepositoryPermissionSetting */
export interface UpdateEnterpriseDefaultRepositoryPermissionSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set the base repository permission setting. */
  enterpriseId: string;
  /** The value for the base repository permission setting on the enterprise. */
  settingValue: EnterpriseDefaultRepositoryPermissionSettingValue;
}
/** Autogenerated input type of UpdateEnterpriseMembersCanChangeRepositoryVisibilitySetting */
export interface UpdateEnterpriseMembersCanChangeRepositoryVisibilitySettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set the members can change repository visibility setting. */
  enterpriseId: string;
  /** The value for the members can change repository visibility setting on the enterprise. */
  settingValue: EnterpriseEnabledDisabledSettingValue;
}
/** Autogenerated input type of UpdateEnterpriseMembersCanCreateRepositoriesSetting */
export interface UpdateEnterpriseMembersCanCreateRepositoriesSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set the members can create repositories setting. */
  enterpriseId: string;
  /** Allow members to create internal repositories. Defaults to current value. */
  membersCanCreateInternalRepositories?: Maybe<boolean>;
  /** Allow members to create private repositories. Defaults to current value. */
  membersCanCreatePrivateRepositories?: Maybe<boolean>;
  /** Allow members to create public repositories. Defaults to current value. */
  membersCanCreatePublicRepositories?: Maybe<boolean>;
  /** When false, allow member organizations to set their own repository creation member privileges. */
  membersCanCreateRepositoriesPolicyEnabled?: Maybe<boolean>;
  /** Value for the members can create repositories setting on the enterprise. This or the granular public/private/internal allowed fields (but not both) must be provided. */
  settingValue?: Maybe<EnterpriseMembersCanCreateRepositoriesSettingValue>;
}
/** Autogenerated input type of UpdateEnterpriseMembersCanDeleteIssuesSetting */
export interface UpdateEnterpriseMembersCanDeleteIssuesSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set the members can delete issues setting. */
  enterpriseId: string;
  /** The value for the members can delete issues setting on the enterprise. */
  settingValue: EnterpriseEnabledDisabledSettingValue;
}
/** Autogenerated input type of UpdateEnterpriseMembersCanDeleteRepositoriesSetting */
export interface UpdateEnterpriseMembersCanDeleteRepositoriesSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set the members can delete repositories setting. */
  enterpriseId: string;
  /** The value for the members can delete repositories setting on the enterprise. */
  settingValue: EnterpriseEnabledDisabledSettingValue;
}
/** Autogenerated input type of UpdateEnterpriseMembersCanInviteCollaboratorsSetting */
export interface UpdateEnterpriseMembersCanInviteCollaboratorsSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set the members can invite collaborators setting. */
  enterpriseId: string;
  /** The value for the members can invite collaborators setting on the enterprise. */
  settingValue: EnterpriseEnabledDisabledSettingValue;
}
/** Autogenerated input type of UpdateEnterpriseMembersCanMakePurchasesSetting */
export interface UpdateEnterpriseMembersCanMakePurchasesSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set the members can make purchases setting. */
  enterpriseId: string;
  /** The value for the members can make purchases setting on the enterprise. */
  settingValue: EnterpriseMembersCanMakePurchasesSettingValue;
}
/** Autogenerated input type of UpdateEnterpriseMembersCanUpdateProtectedBranchesSetting */
export interface UpdateEnterpriseMembersCanUpdateProtectedBranchesSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set the members can update protected branches setting. */
  enterpriseId: string;
  /** The value for the members can update protected branches setting on the enterprise. */
  settingValue: EnterpriseEnabledDisabledSettingValue;
}
/** Autogenerated input type of UpdateEnterpriseMembersCanViewDependencyInsightsSetting */
export interface UpdateEnterpriseMembersCanViewDependencyInsightsSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set the members can view dependency insights setting. */
  enterpriseId: string;
  /** The value for the members can view dependency insights setting on the enterprise. */
  settingValue: EnterpriseEnabledDisabledSettingValue;
}
/** Autogenerated input type of UpdateEnterpriseOrganizationProjectsSetting */
export interface UpdateEnterpriseOrganizationProjectsSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set the organization projects setting. */
  enterpriseId: string;
  /** The value for the organization projects setting on the enterprise. */
  settingValue: EnterpriseEnabledDisabledSettingValue;
}
/** Autogenerated input type of UpdateEnterpriseOwnerOrganizationRole */
export interface UpdateEnterpriseOwnerOrganizationRoleInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the Enterprise which the owner belongs to. */
  enterpriseId: string;
  /** The ID of the organization for membership change. */
  organizationId: string;
  /** The role to assume in the organization. */
  organizationRole: RoleInOrganization;
}
/** Autogenerated input type of UpdateEnterpriseProfile */
export interface UpdateEnterpriseProfileInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The description of the enterprise. */
  description?: Maybe<string>;
  /** The Enterprise ID to update. */
  enterpriseId: string;
  /** The location of the enterprise. */
  location?: Maybe<string>;
  /** The name of the enterprise. */
  name?: Maybe<string>;
  /** The URL of the enterprise's website. */
  websiteUrl?: Maybe<string>;
}
/** Autogenerated input type of UpdateEnterpriseRepositoryProjectsSetting */
export interface UpdateEnterpriseRepositoryProjectsSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set the repository projects setting. */
  enterpriseId: string;
  /** The value for the repository projects setting on the enterprise. */
  settingValue: EnterpriseEnabledDisabledSettingValue;
}
/** Autogenerated input type of UpdateEnterpriseTeamDiscussionsSetting */
export interface UpdateEnterpriseTeamDiscussionsSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set the team discussions setting. */
  enterpriseId: string;
  /** The value for the team discussions setting on the enterprise. */
  settingValue: EnterpriseEnabledDisabledSettingValue;
}
/** Autogenerated input type of UpdateEnterpriseTwoFactorAuthenticationRequiredSetting */
export interface UpdateEnterpriseTwoFactorAuthenticationRequiredSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the enterprise on which to set the two factor authentication required setting. */
  enterpriseId: string;
  /** The value for the two factor authentication required setting on the enterprise. */
  settingValue: EnterpriseEnabledSettingValue;
}
/** Autogenerated input type of UpdateEnvironment */
export interface UpdateEnvironmentInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The node ID of the environment. */
  environmentId: string;
  /** The ids of users or teams that can approve deployments to this environment */
  reviewers?: Maybe<string[]>;
  /** The wait timer in minutes. */
  waitTimer?: Maybe<number>;
}
/** Autogenerated input type of UpdateIpAllowListEnabledSetting */
export interface UpdateIpAllowListEnabledSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the owner on which to set the IP allow list enabled setting. */
  ownerId: string;
  /** The value for the IP allow list enabled setting. */
  settingValue: IpAllowListEnabledSettingValue;
}
/** Autogenerated input type of UpdateIpAllowListEntry */
export interface UpdateIpAllowListEntryInput {
  /** An IP address or range of addresses in CIDR notation. */
  allowListValue: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the IP allow list entry to update. */
  ipAllowListEntryId: string;
  /** Whether the IP allow list entry is active when an IP allow list is enabled. */
  isActive: boolean;
  /** An optional name for the IP allow list entry. */
  name?: Maybe<string>;
}
/** Autogenerated input type of UpdateIpAllowListForInstalledAppsEnabledSetting */
export interface UpdateIpAllowListForInstalledAppsEnabledSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the owner. */
  ownerId: string;
  /** The value for the IP allow list configuration for installed GitHub Apps setting. */
  settingValue: IpAllowListForInstalledAppsEnabledSettingValue;
}
/** Autogenerated input type of UpdateIssue */
export interface UpdateIssueInput {
  /** An array of Node IDs of users for this issue. */
  assigneeIds?: Maybe<string[]>;
  /** The body for the issue description. */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the Issue to modify. */
  id: string;
  /** An array of Node IDs of labels for this issue. */
  labelIds?: Maybe<string[]>;
  /** The Node ID of the milestone for this issue. */
  milestoneId?: Maybe<string>;
  /** An array of Node IDs for projects associated with this issue. */
  projectIds?: Maybe<string[]>;
  /** The desired issue state. */
  state?: Maybe<IssueState>;
  /** The title for the issue. */
  title?: Maybe<string>;
}
/** Autogenerated input type of UpdateIssueComment */
export interface UpdateIssueCommentInput {
  /** The updated text of the comment. */
  body: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the IssueComment to modify. */
  id: string;
}
/** Autogenerated input type of UpdateLabel */
export interface UpdateLabelInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** A 6 character hex code, without the leading #, identifying the updated color of the label. */
  color?: Maybe<string>;
  /** A brief description of the label, such as its purpose. */
  description?: Maybe<string>;
  /** The Node ID of the label to be updated. */
  id: string;
  /** The updated name of the label. */
  name?: Maybe<string>;
}
/** Autogenerated input type of UpdateNotificationRestrictionSetting */
export interface UpdateNotificationRestrictionSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the owner on which to set the restrict notifications setting. */
  ownerId: string;
  /** The value for the restrict notifications setting. */
  settingValue: NotificationRestrictionSettingValue;
}
/** Autogenerated input type of UpdateOrganizationAllowPrivateRepositoryForkingSetting */
export interface UpdateOrganizationAllowPrivateRepositoryForkingSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Enable forking of private repositories in the organization? */
  forkingEnabled: boolean;
  /** The ID of the organization on which to set the allow private repository forking setting. */
  organizationId: string;
}
/** Autogenerated input type of UpdateOrganizationWebCommitSignoffSetting */
export interface UpdateOrganizationWebCommitSignoffSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the organization on which to set the web commit signoff setting. */
  organizationId: string;
  /** Enable signoff on web-based commits for repositories in the organization? */
  webCommitSignoffRequired: boolean;
}
/** Autogenerated input type of UpdateProject */
export interface UpdateProjectInput {
  /** The description of project. */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The name of project. */
  name?: Maybe<string>;
  /** The Project ID to update. */
  projectId: string;
  /** Whether the project is public or not. */
  public?: Maybe<boolean>;
  /** Whether the project is open or closed. */
  state?: Maybe<ProjectState>;
}
/** Autogenerated input type of UpdateProjectCard */
export interface UpdateProjectCardInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Whether or not the ProjectCard should be archived */
  isArchived?: Maybe<boolean>;
  /** The note of ProjectCard. */
  note?: Maybe<string>;
  /** The ProjectCard ID to update. */
  projectCardId: string;
}
/** Autogenerated input type of UpdateProjectColumn */
export interface UpdateProjectColumnInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The name of project column. */
  name: string;
  /** The ProjectColumn ID to update. */
  projectColumnId: string;
}
/** Autogenerated input type of UpdateProjectV2 */
export interface UpdateProjectV2Input {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Set the project to closed or open. */
  closed?: Maybe<boolean>;
  /** The ID of the Project to update. */
  projectId: string;
  /** Set the project to public or private. */
  public?: Maybe<boolean>;
  /** Set the readme description of the project. */
  readme?: Maybe<string>;
  /** Set the short description of the project. */
  shortDescription?: Maybe<string>;
  /** Set the title of the project. */
  title?: Maybe<string>;
}
/** Autogenerated input type of UpdateProjectV2DraftIssue */
export interface UpdateProjectV2DraftIssueInput {
  /** The IDs of the assignees of the draft issue. */
  assigneeIds?: Maybe<string[]>;
  /** The body of the draft issue. */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the draft issue to update. */
  draftIssueId: string;
  /** The title of the draft issue. */
  title?: Maybe<string>;
}
/** Autogenerated input type of UpdateProjectV2ItemFieldValue */
export interface UpdateProjectV2ItemFieldValueInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the field to be updated. */
  fieldId: string;
  /** The ID of the item to be updated. */
  itemId: string;
  /** The ID of the Project. */
  projectId: string;
  /** The value which will be set on the field. */
  value: ProjectV2FieldValue;
}
/** The values that can be used to update a field of an item inside a Project. Only 1 value can be updated at a time. */
export interface ProjectV2FieldValue {
  /** The ISO 8601 date to set on the field. */
  date?: Maybe<Date>;
  /** The id of the iteration to set on the field. */
  iterationId?: Maybe<string>;
  /** The number to set on the field. */
  number?: Maybe<number>;
  /** The id of the single select option to set on the field. */
  singleSelectOptionId?: Maybe<string>;
  /** The text to set on the field. */
  text?: Maybe<string>;
}
/** Autogenerated input type of UpdateProjectV2ItemPosition */
export interface UpdateProjectV2ItemPositionInput {
  /** The ID of the item to position this item after. If omitted or set to null the item will be moved to top. */
  afterId?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the item to be moved. */
  itemId: string;
  /** The ID of the Project. */
  projectId: string;
}
/** Autogenerated input type of UpdatePullRequest */
export interface UpdatePullRequestInput {
  /** An array of Node IDs of users for this pull request. */
  assigneeIds?: Maybe<string[]>;
  /** The name of the branch you want your changes pulled into. This should be an existing branch on the current repository. */
  baseRefName?: Maybe<string>;
  /** The contents of the pull request. */
  body?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** An array of Node IDs of labels for this pull request. */
  labelIds?: Maybe<string[]>;
  /** Indicates whether maintainers can modify the pull request. */
  maintainerCanModify?: Maybe<boolean>;
  /** The Node ID of the milestone for this pull request. */
  milestoneId?: Maybe<string>;
  /** An array of Node IDs for projects associated with this pull request. */
  projectIds?: Maybe<string[]>;
  /** The Node ID of the pull request. */
  pullRequestId: string;
  /** The target state of the pull request. */
  state?: Maybe<PullRequestUpdateState>;
  /** The title of the pull request. */
  title?: Maybe<string>;
}
/** Autogenerated input type of UpdatePullRequestBranch */
export interface UpdatePullRequestBranchInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The head ref oid for the upstream branch. */
  expectedHeadOid?: Maybe<GitObjectId>;
  /** The Node ID of the pull request. */
  pullRequestId: string;
}
/** Autogenerated input type of UpdatePullRequestReview */
export interface UpdatePullRequestReviewInput {
  /** The contents of the pull request review body. */
  body: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the pull request review to modify. */
  pullRequestReviewId: string;
}
/** Autogenerated input type of UpdatePullRequestReviewComment */
export interface UpdatePullRequestReviewCommentInput {
  /** The text of the comment. */
  body: string;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the comment to modify. */
  pullRequestReviewCommentId: string;
}
/** Autogenerated input type of UpdateRef */
export interface UpdateRefInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Permit updates of branch Refs that are not fast-forwards? */
  force?: boolean;
  /** The GitObjectID that the Ref shall be updated to target. */
  oid: GitObjectId;
  /** The Node ID of the Ref to be updated. */
  refId: string;
}
/** Autogenerated input type of UpdateRefs */
export interface UpdateRefsInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** A list of ref updates. */
  refUpdates: RefUpdate[];
  /** The Node ID of the repository. */
  repositoryId: string;
}
/** A ref update */
export interface RefUpdate {
  /** The value this ref should be updated to. */
  afterOid: GitObjectId;
  /** The value this ref needs to point to before the update. */
  beforeOid?: Maybe<GitObjectId>;
  /** Force a non fast-forward update. */
  force?: boolean;
  /** The fully qualified name of the ref to be update. For example `refs/heads/branch-name` */
  name: GitRefname;
}
/** Autogenerated input type of UpdateRepository */
export interface UpdateRepositoryInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** A new description for the repository. Pass an empty string to erase the existing description. */
  description?: Maybe<string>;
  /** Indicates if the repository should have the discussions feature enabled. */
  hasDiscussionsEnabled?: Maybe<boolean>;
  /** Indicates if the repository should have the issues feature enabled. */
  hasIssuesEnabled?: Maybe<boolean>;
  /** Indicates if the repository should have the project boards feature enabled. */
  hasProjectsEnabled?: Maybe<boolean>;
  /** Indicates if the repository should have the wiki feature enabled. */
  hasWikiEnabled?: Maybe<boolean>;
  /** The URL for a web page about this repository. Pass an empty string to erase the existing URL. */
  homepageUrl?: Maybe<Uri>;
  /** The new name of the repository. */
  name?: Maybe<string>;
  /** The ID of the repository to update. */
  repositoryId: string;
  /** Whether this repository should be marked as a template such that anyone who can access it can create new repositories with the same files and directory structure. */
  template?: Maybe<boolean>;
}
/** Autogenerated input type of UpdateRepositoryRuleset */
export interface UpdateRepositoryRulesetInput {
  /** A list of Team or App IDs allowed to bypass rules in this ruleset. */
  bypassActorIds?: Maybe<string[]>;
  /** The bypass mode for this ruleset */
  bypassMode?: Maybe<RuleBypassMode>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The list of conditions for this ruleset */
  conditions?: Maybe<RepositoryRuleConditionsInput>;
  /** The enforcement level for this ruleset */
  enforcement?: Maybe<RuleEnforcement>;
  /** The name of the ruleset. */
  name?: Maybe<string>;
  /** The global relay id of the repository ruleset to be updated. */
  repositoryRulesetId: string;
  /** The list of rules for this ruleset */
  rules?: Maybe<RepositoryRuleInput[]>;
  /** The target of the ruleset. */
  target?: Maybe<RepositoryRulesetTarget>;
}
/** Autogenerated input type of UpdateRepositoryWebCommitSignoffSetting */
export interface UpdateRepositoryWebCommitSignoffSettingInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the repository to update. */
  repositoryId: string;
  /** Indicates if the repository should require signoff on web-based commits. */
  webCommitSignoffRequired: boolean;
}
/** Autogenerated input type of UpdateSponsorshipPreferences */
export interface UpdateSponsorshipPreferencesInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Specify whether others should be able to see that the sponsor is sponsoring the sponsorable. Public visibility still does not reveal which tier is used. */
  privacyLevel?: SponsorshipPrivacy;
  /** Whether the sponsor should receive email updates from the sponsorable. */
  receiveEmails?: boolean;
  /** The ID of the user or organization who is receiving the sponsorship. Required if sponsorableLogin is not given. */
  sponsorableId?: Maybe<string>;
  /** The username of the user or organization who is receiving the sponsorship. Required if sponsorableId is not given. */
  sponsorableLogin?: Maybe<string>;
  /** The ID of the user or organization who is acting as the sponsor, paying for the sponsorship. Required if sponsorLogin is not given. */
  sponsorId?: Maybe<string>;
  /** The username of the user or organization who is acting as the sponsor, paying for the sponsorship. Required if sponsorId is not given. */
  sponsorLogin?: Maybe<string>;
}
/** Autogenerated input type of UpdateSubscription */
export interface UpdateSubscriptionInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The new state of the subscription. */
  state: SubscriptionState;
  /** The Node ID of the subscribable object to modify. */
  subscribableId: string;
}
/** Autogenerated input type of UpdateTeamDiscussion */
export interface UpdateTeamDiscussionInput {
  /** The updated text of the discussion. */
  body?: Maybe<string>;
  /** The current version of the body content. If provided, this update operation will be rejected if the given version does not match the latest version on the server. */
  bodyVersion?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the discussion to modify. */
  id: string;
  /** If provided, sets the pinned state of the updated discussion. */
  pinned?: Maybe<boolean>;
  /** The updated title of the discussion. */
  title?: Maybe<string>;
}
/** Autogenerated input type of UpdateTeamDiscussionComment */
export interface UpdateTeamDiscussionCommentInput {
  /** The updated text of the comment. */
  body: string;
  /** The current version of the body content. */
  bodyVersion?: Maybe<string>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the comment to modify. */
  id: string;
}
/** Autogenerated input type of UpdateTeamReviewAssignment */
export interface UpdateTeamReviewAssignmentInput {
  /** The algorithm to use for review assignment */
  algorithm?: TeamReviewAssignmentAlgorithm;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Turn on or off review assignment */
  enabled: boolean;
  /** An array of team member IDs to exclude */
  excludedTeamMemberIds?: Maybe<string[]>;
  /** The Node ID of the team to update review assignments of */
  id: string;
  /** Notify the entire team of the PR if it is delegated */
  notifyTeam?: boolean;
  /** The number of team members to assign */
  teamMemberCount?: number;
}
/** Autogenerated input type of UpdateTeamsRepository */
export interface UpdateTeamsRepositoryInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** Permission that should be granted to the teams. */
  permission: RepositoryPermission;
  /** Repository ID being granted access to. */
  repositoryId: string;
  /** A list of teams being granted access. Limit: 10 */
  teamIds: string[];
}
/** Autogenerated input type of UpdateTopics */
export interface UpdateTopicsInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The Node ID of the repository. */
  repositoryId: string;
  /** An array of topic names. */
  topicNames: string[];
}
/** Autogenerated input type of VerifyVerifiableDomain */
export interface VerifyVerifiableDomainInput {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<string>;
  /** The ID of the verifiable domain to verify. */
  id: string;
}
/** The possible GitHub Enterprise deployments where this user can exist. */
  export enum EnterpriseUserDeployment {
    Cloud = "CLOUD",
    Server = "SERVER",
  }
/** Possible directions in which to order a list of items when provided an `orderBy` argument. */
  export enum OrderDirection {
    Asc = "ASC",
    Desc = "DESC",
  }
/** Properties by which enterprise member connections can be ordered. */
  export enum EnterpriseMemberOrderField {
    CreatedAt = "CREATED_AT",
    Login = "LOGIN",
  }
/** The possible roles for enterprise membership. */
  export enum EnterpriseUserAccountMembershipRole {
    Member = "MEMBER",
    Owner = "OWNER",
    Unaffiliated = "UNAFFILIATED",
  }
/** Properties by which Enterprise Server installation connections can be ordered. */
  export enum EnterpriseServerInstallationOrderField {
    CreatedAt = "CREATED_AT",
    CustomerName = "CUSTOMER_NAME",
    HostName = "HOST_NAME",
  }
/** Properties by which Enterprise Server user account connections can be ordered. */
  export enum EnterpriseServerUserAccountOrderField {
    Login = "LOGIN",
    RemoteCreatedAt = "REMOTE_CREATED_AT",
  }
/** Properties by which Enterprise Server user account email connections can be ordered. */
  export enum EnterpriseServerUserAccountEmailOrderField {
    Email = "EMAIL",
  }
/** Properties by which Enterprise Server user accounts upload connections can be ordered. */
  export enum EnterpriseServerUserAccountsUploadOrderField {
    CreatedAt = "CREATED_AT",
  }
/** Synchronization state of the Enterprise Server user accounts upload */
  export enum EnterpriseServerUserAccountsUploadSyncState {
    Failure = "FAILURE",
    Pending = "PENDING",
    Success = "SUCCESS",
  }
/** Properties by which organization connections can be ordered. */
  export enum OrganizationOrderField {
    CreatedAt = "CREATED_AT",
    Login = "LOGIN",
  }
/** Properties by which user status connections can be ordered. */
  export enum UserStatusOrderField {
    UpdatedAt = "UPDATED_AT",
  }
/** Properties by which package connections can be ordered. */
  export enum PackageOrderField {
    CreatedAt = "CREATED_AT",
  }
/** The possible types of a package. */
  export enum PackageType {
    Debian = "DEBIAN",
    Docker = "DOCKER",
    Maven = "MAVEN",
    Npm = "NPM",
    Nuget = "NUGET",
    Pypi = "PYPI",
    Rubygems = "RUBYGEMS",
  }
/** Properties by which package file connections can be ordered. */
  export enum PackageFileOrderField {
    CreatedAt = "CREATED_AT",
  }
/** Emojis that can be attached to Issues, Pull Requests and Comments. */
  export enum ReactionContent {
    Confused = "CONFUSED",
    Eyes = "EYES",
    Heart = "HEART",
    Hooray = "HOORAY",
    Laugh = "LAUGH",
    Rocket = "ROCKET",
    ThumbsDown = "THUMBS_DOWN",
    ThumbsUp = "THUMBS_UP",
  }
/** A list of fields that reactions can be ordered by. */
  export enum ReactionOrderField {
    CreatedAt = "CREATED_AT",
  }
/** The possible archived states of a project card. */
  export enum ProjectCardArchivedState {
    Archived = "ARCHIVED",
    NotArchived = "NOT_ARCHIVED",
  }
/** A comment author association with repository. */
  export enum CommentAuthorAssociation {
    Collaborator = "COLLABORATOR",
    Contributor = "CONTRIBUTOR",
    FirstTimeContributor = "FIRST_TIME_CONTRIBUTOR",
    FirstTimer = "FIRST_TIMER",
    Mannequin = "MANNEQUIN",
    Member = "MEMBER",
    None = "NONE",
    Owner = "OWNER",
  }
/** Properties by which label connections can be ordered. */
  export enum LabelOrderField {
    CreatedAt = "CREATED_AT",
    Name = "NAME",
  }
/** The possible states of an issue. */
  export enum IssueState {
    Closed = "CLOSED",
    Open = "OPEN",
  }
/** Properties by which issue connections can be ordered. */
  export enum IssueOrderField {
    Comments = "COMMENTS",
    CreatedAt = "CREATED_AT",
    UpdatedAt = "UPDATED_AT",
  }
/** The possible states of a pull request. */
  export enum PullRequestState {
    Closed = "CLOSED",
    Merged = "MERGED",
    Open = "OPEN",
  }
/** The possible reasons that an issue or pull request was locked. */
  export enum LockReason {
    OffTopic = "OFF_TOPIC",
    Resolved = "RESOLVED",
    Spam = "SPAM",
    TooHeated = "TOO_HEATED",
  }
/** Properties by which projects can be ordered. */
  export enum ProjectV2OrderField {
    CreatedAt = "CREATED_AT",
    Number = "NUMBER",
    Title = "TITLE",
    UpdatedAt = "UPDATED_AT",
  }
/** The type of a project field. */
  export enum ProjectV2FieldType {
    Assignees = "ASSIGNEES",
    Date = "DATE",
    Iteration = "ITERATION",
    Labels = "LABELS",
    LinkedPullRequests = "LINKED_PULL_REQUESTS",
    Milestone = "MILESTONE",
    Number = "NUMBER",
    Repository = "REPOSITORY",
    Reviewers = "REVIEWERS",
    SingleSelect = "SINGLE_SELECT",
    Text = "TEXT",
    Title = "TITLE",
    TrackedBy = "TRACKED_BY",
    Tracks = "TRACKS",
  }
/** Properties by which project v2 field connections can be ordered. */
  export enum ProjectV2FieldOrderField {
    CreatedAt = "CREATED_AT",
    Name = "NAME",
    Position = "POSITION",
  }
/** Properties by which project v2 item connections can be ordered. */
  export enum ProjectV2ItemOrderField {
    Position = "POSITION",
  }
/** The possible states of a milestone. */
  export enum MilestoneState {
    Closed = "CLOSED",
    Open = "OPEN",
  }
/** Properties by which pull_requests connections can be ordered. */
  export enum PullRequestOrderField {
    CreatedAt = "CREATED_AT",
    UpdatedAt = "UPDATED_AT",
  }
/** The possible states of a subscription. */
  export enum SubscriptionState {
    Ignored = "IGNORED",
    Subscribed = "SUBSCRIBED",
    Unsubscribed = "UNSUBSCRIBED",
  }
/** Properties by which team connections can be ordered. */
  export enum TeamOrderField {
    Name = "NAME",
  }
/** The possible errors that will prevent a user from updating a comment. */
  export enum CommentCannotUpdateReason {
    Archived = "ARCHIVED",
    Denied = "DENIED",
    InsufficientAccess = "INSUFFICIENT_ACCESS",
    Locked = "LOCKED",
    LoginRequired = "LOGIN_REQUIRED",
    Maintenance = "MAINTENANCE",
    VerifiedEmailRequired = "VERIFIED_EMAIL_REQUIRED",
  }
/** Properties by which team discussion comment connections can be ordered. */
  export enum TeamDiscussionCommentOrderField {
    Number = "NUMBER",
  }
/** Properties by which team discussion connections can be ordered. */
  export enum TeamDiscussionOrderField {
    CreatedAt = "CREATED_AT",
  }
/** The possible organization invitation sources. */
  export enum OrganizationInvitationSource {
    Member = "MEMBER",
    Scim = "SCIM",
    Unknown = "UNKNOWN",
  }
/** The possible organization invitation types. */
  export enum OrganizationInvitationType {
    Email = "EMAIL",
    User = "USER",
  }
/** The possible organization invitation roles. */
  export enum OrganizationInvitationRole {
    Admin = "ADMIN",
    BillingManager = "BILLING_MANAGER",
    DirectMember = "DIRECT_MEMBER",
    Reinstate = "REINSTATE",
  }
/** Defines which types of team members are included in the returned list. Can be one of IMMEDIATE, CHILD_TEAM or ALL. */
  export enum TeamMembershipType {
    All = "ALL",
    ChildTeam = "CHILD_TEAM",
    Immediate = "IMMEDIATE",
  }
/** Properties by which team member connections can be ordered. */
  export enum TeamMemberOrderField {
    CreatedAt = "CREATED_AT",
    Login = "LOGIN",
  }
/** The possible team member roles; either 'maintainer' or 'member'. */
  export enum TeamMemberRole {
    Maintainer = "MAINTAINER",
    Member = "MEMBER",
  }
/** The possible team notification values. */
  export enum TeamNotificationSetting {
    NotificationsDisabled = "NOTIFICATIONS_DISABLED",
    NotificationsEnabled = "NOTIFICATIONS_ENABLED",
  }
/** The possible team privacy values. */
  export enum TeamPrivacy {
    Secret = "SECRET",
    Visible = "VISIBLE",
  }
/** The possible states of a project v2. */
  export enum ProjectV2State {
    Closed = "CLOSED",
    Open = "OPEN",
  }
/** Properties by which team repository connections can be ordered. */
  export enum TeamRepositoryOrderField {
    CreatedAt = "CREATED_AT",
    Name = "NAME",
    Permission = "PERMISSION",
    PushedAt = "PUSHED_AT",
    Stargazers = "STARGAZERS",
    UpdatedAt = "UPDATED_AT",
  }
/** The access level to a repository */
  export enum RepositoryPermission {
    Admin = "ADMIN",
    Maintain = "MAINTAIN",
    Read = "READ",
    Triage = "TRIAGE",
    Write = "WRITE",
  }
/** The possible team review assignment algorithms */
  export enum TeamReviewAssignmentAlgorithm {
    LoadBalance = "LOAD_BALANCE",
    RoundRobin = "ROUND_ROBIN",
  }
/** Properties by which project v2 item field value connections can be ordered. */
  export enum ProjectV2ItemFieldValueOrderField {
    Position = "POSITION",
  }
/** The type of a project item. */
  export enum ProjectV2ItemType {
    DraftIssue = "DRAFT_ISSUE",
    Issue = "ISSUE",
    PullRequest = "PULL_REQUEST",
    Redacted = "REDACTED",
  }
/** Properties by which repository connections can be ordered. */
  export enum RepositoryOrderField {
    CreatedAt = "CREATED_AT",
    Name = "NAME",
    PushedAt = "PUSHED_AT",
    Stargazers = "STARGAZERS",
    UpdatedAt = "UPDATED_AT",
  }
/** The layout of a project v2 view. */
  export enum ProjectV2ViewLayout {
    BoardLayout = "BOARD_LAYOUT",
    RoadmapLayout = "ROADMAP_LAYOUT",
    TableLayout = "TABLE_LAYOUT",
  }
/** Properties by which project v2 view connections can be ordered. */
  export enum ProjectV2ViewOrderField {
    CreatedAt = "CREATED_AT",
    Name = "NAME",
    Position = "POSITION",
  }
/** Properties by which project workflows can be ordered. */
  export enum ProjectV2WorkflowsOrderField {
    CreatedAt = "CREATED_AT",
    Name = "NAME",
    Number = "NUMBER",
    UpdatedAt = "UPDATED_AT",
  }
/** Represents available types of methods to use when merging a pull request. */
  export enum PullRequestMergeMethod {
    Merge = "MERGE",
    Rebase = "REBASE",
    Squash = "SQUASH",
  }
/** Properties by which IP allow list entry connections can be ordered. */
  export enum IpAllowListEntryOrderField {
    AllowListValue = "ALLOW_LIST_VALUE",
    CreatedAt = "CREATED_AT",
  }
/** The possible types of check runs. */
  export enum CheckRunType {
    All = "ALL",
    Latest = "LATEST",
  }
/** The possible states for a check suite or run conclusion. */
  export enum CheckConclusionState {
    ActionRequired = "ACTION_REQUIRED",
    Cancelled = "CANCELLED",
    Failure = "FAILURE",
    Neutral = "NEUTRAL",
    Skipped = "SKIPPED",
    Stale = "STALE",
    StartupFailure = "STARTUP_FAILURE",
    Success = "SUCCESS",
    TimedOut = "TIMED_OUT",
  }
/** The possible states for a check suite or run status. */
  export enum CheckStatusState {
    Completed = "COMPLETED",
    InProgress = "IN_PROGRESS",
    Pending = "PENDING",
    Queued = "QUEUED",
    Requested = "REQUESTED",
    Waiting = "WAITING",
  }
/** Represents an annotation's information level. */
  export enum CheckAnnotationLevel {
    Failure = "FAILURE",
    Notice = "NOTICE",
    Warning = "WARNING",
  }
/** The possible states for a deployment status. */
  export enum DeploymentStatusState {
    Error = "ERROR",
    Failure = "FAILURE",
    InProgress = "IN_PROGRESS",
    Inactive = "INACTIVE",
    Pending = "PENDING",
    Queued = "QUEUED",
    Success = "SUCCESS",
    Waiting = "WAITING",
  }
/** The possible states in which a deployment can be. */
  export enum DeploymentState {
    Abandoned = "ABANDONED",
    Active = "ACTIVE",
    Destroyed = "DESTROYED",
    Error = "ERROR",
    Failure = "FAILURE",
    InProgress = "IN_PROGRESS",
    Inactive = "INACTIVE",
    Pending = "PENDING",
    Queued = "QUEUED",
    Success = "SUCCESS",
    Waiting = "WAITING",
  }
/** The possible protection rule types. */
  export enum DeploymentProtectionRuleType {
    RequiredReviewers = "REQUIRED_REVIEWERS",
    WaitTimer = "WAIT_TIMER",
  }
/** The possible states for a deployment review. */
  export enum DeploymentReviewState {
    Approved = "APPROVED",
    Rejected = "REJECTED",
  }
/** Properties by which workflow run connections can be ordered. */
  export enum WorkflowRunOrderField {
    CreatedAt = "CREATED_AT",
  }
/** The possible states for a workflow. */
  export enum WorkflowState {
    Active = "ACTIVE",
    Deleted = "DELETED",
    DisabledFork = "DISABLED_FORK",
    DisabledInactivity = "DISABLED_INACTIVITY",
    DisabledManually = "DISABLED_MANUALLY",
  }
/** Properties by which deployment connections can be ordered. */
  export enum DeploymentOrderField {
    CreatedAt = "CREATED_AT",
  }
/** The state of a Git signature. */
  export enum GitSignatureState {
    BadCert = "BAD_CERT",
    BadEmail = "BAD_EMAIL",
    ExpiredKey = "EXPIRED_KEY",
    GpgverifyError = "GPGVERIFY_ERROR",
    GpgverifyUnavailable = "GPGVERIFY_UNAVAILABLE",
    Invalid = "INVALID",
    MalformedSig = "MALFORMED_SIG",
    NoUser = "NO_USER",
    NotSigningKey = "NOT_SIGNING_KEY",
    OcspError = "OCSP_ERROR",
    OcspPending = "OCSP_PENDING",
    OcspRevoked = "OCSP_REVOKED",
    UnknownKey = "UNKNOWN_KEY",
    UnknownSigType = "UNKNOWN_SIG_TYPE",
    Unsigned = "UNSIGNED",
    UnverifiedEmail = "UNVERIFIED_EMAIL",
    Valid = "VALID",
  }
/** The possible states of a check run in a status rollup. */
  export enum CheckRunState {
    ActionRequired = "ACTION_REQUIRED",
    Cancelled = "CANCELLED",
    Completed = "COMPLETED",
    Failure = "FAILURE",
    InProgress = "IN_PROGRESS",
    Neutral = "NEUTRAL",
    Pending = "PENDING",
    Queued = "QUEUED",
    Skipped = "SKIPPED",
    Stale = "STALE",
    StartupFailure = "STARTUP_FAILURE",
    Success = "SUCCESS",
    TimedOut = "TIMED_OUT",
    Waiting = "WAITING",
  }
/** The possible commit status states. */
  export enum StatusState {
    Error = "ERROR",
    Expected = "EXPECTED",
    Failure = "FAILURE",
    Pending = "PENDING",
    Success = "SUCCESS",
  }
/** The status of a git comparison between two refs. */
  export enum ComparisonStatus {
    Ahead = "AHEAD",
    Behind = "BEHIND",
    Diverged = "DIVERGED",
    Identical = "IDENTICAL",
  }
/** Properties by which issue comment connections can be ordered. */
  export enum IssueCommentOrderField {
    UpdatedAt = "UPDATED_AT",
  }
/** The possible types of patch statuses. */
  export enum PatchStatus {
    Added = "ADDED",
    Changed = "CHANGED",
    Copied = "COPIED",
    Deleted = "DELETED",
    Modified = "MODIFIED",
    Renamed = "RENAMED",
  }
/** The possible viewed states of a file . */
  export enum FileViewedState {
    Dismissed = "DISMISSED",
    Unviewed = "UNVIEWED",
    Viewed = "VIEWED",
  }
/** The affiliation of a user to a repository */
  export enum RepositoryAffiliation {
    Collaborator = "COLLABORATOR",
    OrganizationMember = "ORGANIZATION_MEMBER",
    Owner = "OWNER",
  }
/** The privacy of a repository */
  export enum RepositoryPrivacy {
    Private = "PRIVATE",
    Public = "PUBLIC",
  }
/** The possible states of a pull request review comment. */
  export enum PullRequestReviewCommentState {
    Pending = "PENDING",
    Submitted = "SUBMITTED",
  }
/** The possible subject types of a pull request review comment. */
  export enum PullRequestReviewThreadSubjectType {
    File = "FILE",
    Line = "LINE",
  }
/** The possible states of a pull request review. */
  export enum PullRequestReviewState {
    Approved = "APPROVED",
    ChangesRequested = "CHANGES_REQUESTED",
    Commented = "COMMENTED",
    Dismissed = "DISMISSED",
    Pending = "PENDING",
  }
/** Whether or not a PullRequest can be merged. */
  export enum MergeableState {
    Conflicting = "CONFLICTING",
    Mergeable = "MERGEABLE",
    Unknown = "UNKNOWN",
  }
/** The possible merging strategies for a merge queue. */
  export enum MergeQueueMergingStrategy {
    Allgreen = "ALLGREEN",
    Headgreen = "HEADGREEN",
  }
/** The possible states for a merge queue entry. */
  export enum MergeQueueEntryState {
    AwaitingChecks = "AWAITING_CHECKS",
    Locked = "LOCKED",
    Mergeable = "MERGEABLE",
    Queued = "QUEUED",
    Unmergeable = "UNMERGEABLE",
  }
/** Detailed status information about a pull request merge. */
  export enum MergeStateStatus {
    Behind = "BEHIND",
    Blocked = "BLOCKED",
    Clean = "CLEAN",
    Dirty = "DIRTY",
    Draft = "DRAFT",
    HasHooks = "HAS_HOOKS",
    Unknown = "UNKNOWN",
    Unstable = "UNSTABLE",
  }
/** The review status of a pull request. */
  export enum PullRequestReviewDecision {
    Approved = "APPROVED",
    ChangesRequested = "CHANGES_REQUESTED",
    ReviewRequired = "REVIEW_REQUIRED",
  }
/** The possible sides of a diff. */
  export enum DiffSide {
    Left = "LEFT",
    Right = "RIGHT",
  }
/** The possible state reasons of an issue. */
  export enum IssueStateReason {
    Completed = "COMPLETED",
    NotPlanned = "NOT_PLANNED",
    Reopened = "REOPENED",
  }
/** The possible durations that a user can be blocked for. */
  export enum UserBlockDuration {
    OneDay = "ONE_DAY",
    OneMonth = "ONE_MONTH",
    OneWeek = "ONE_WEEK",
    Permanent = "PERMANENT",
    ThreeDays = "THREE_DAYS",
  }
/** The possible item types found in a timeline. */
  export enum PullRequestTimelineItemsItemType {
    AddedToMergeQueueEvent = "ADDED_TO_MERGE_QUEUE_EVENT",
    AddedToProjectEvent = "ADDED_TO_PROJECT_EVENT",
    AssignedEvent = "ASSIGNED_EVENT",
    AutoMergeDisabledEvent = "AUTO_MERGE_DISABLED_EVENT",
    AutoMergeEnabledEvent = "AUTO_MERGE_ENABLED_EVENT",
    AutoRebaseEnabledEvent = "AUTO_REBASE_ENABLED_EVENT",
    AutoSquashEnabledEvent = "AUTO_SQUASH_ENABLED_EVENT",
    AutomaticBaseChangeFailedEvent = "AUTOMATIC_BASE_CHANGE_FAILED_EVENT",
    AutomaticBaseChangeSucceededEvent = "AUTOMATIC_BASE_CHANGE_SUCCEEDED_EVENT",
    BaseRefChangedEvent = "BASE_REF_CHANGED_EVENT",
    BaseRefDeletedEvent = "BASE_REF_DELETED_EVENT",
    BaseRefForcePushedEvent = "BASE_REF_FORCE_PUSHED_EVENT",
    ClosedEvent = "CLOSED_EVENT",
    CommentDeletedEvent = "COMMENT_DELETED_EVENT",
    ConnectedEvent = "CONNECTED_EVENT",
    ConvertToDraftEvent = "CONVERT_TO_DRAFT_EVENT",
    ConvertedNoteToIssueEvent = "CONVERTED_NOTE_TO_ISSUE_EVENT",
    ConvertedToDiscussionEvent = "CONVERTED_TO_DISCUSSION_EVENT",
    CrossReferencedEvent = "CROSS_REFERENCED_EVENT",
    DemilestonedEvent = "DEMILESTONED_EVENT",
    DeployedEvent = "DEPLOYED_EVENT",
    DeploymentEnvironmentChangedEvent = "DEPLOYMENT_ENVIRONMENT_CHANGED_EVENT",
    DisconnectedEvent = "DISCONNECTED_EVENT",
    HeadRefDeletedEvent = "HEAD_REF_DELETED_EVENT",
    HeadRefForcePushedEvent = "HEAD_REF_FORCE_PUSHED_EVENT",
    HeadRefRestoredEvent = "HEAD_REF_RESTORED_EVENT",
    IssueComment = "ISSUE_COMMENT",
    LabeledEvent = "LABELED_EVENT",
    LockedEvent = "LOCKED_EVENT",
    MarkedAsDuplicateEvent = "MARKED_AS_DUPLICATE_EVENT",
    MentionedEvent = "MENTIONED_EVENT",
    MergedEvent = "MERGED_EVENT",
    MilestonedEvent = "MILESTONED_EVENT",
    MovedColumnsInProjectEvent = "MOVED_COLUMNS_IN_PROJECT_EVENT",
    PinnedEvent = "PINNED_EVENT",
    PullRequestCommit = "PULL_REQUEST_COMMIT",
    PullRequestCommitCommentThread = "PULL_REQUEST_COMMIT_COMMENT_THREAD",
    PullRequestReview = "PULL_REQUEST_REVIEW",
    PullRequestReviewThread = "PULL_REQUEST_REVIEW_THREAD",
    PullRequestRevisionMarker = "PULL_REQUEST_REVISION_MARKER",
    ReadyForReviewEvent = "READY_FOR_REVIEW_EVENT",
    ReferencedEvent = "REFERENCED_EVENT",
    RemovedFromMergeQueueEvent = "REMOVED_FROM_MERGE_QUEUE_EVENT",
    RemovedFromProjectEvent = "REMOVED_FROM_PROJECT_EVENT",
    RenamedTitleEvent = "RENAMED_TITLE_EVENT",
    ReopenedEvent = "REOPENED_EVENT",
    ReviewDismissedEvent = "REVIEW_DISMISSED_EVENT",
    ReviewRequestRemovedEvent = "REVIEW_REQUEST_REMOVED_EVENT",
    ReviewRequestedEvent = "REVIEW_REQUESTED_EVENT",
    SubscribedEvent = "SUBSCRIBED_EVENT",
    TransferredEvent = "TRANSFERRED_EVENT",
    UnassignedEvent = "UNASSIGNED_EVENT",
    UnlabeledEvent = "UNLABELED_EVENT",
    UnlockedEvent = "UNLOCKED_EVENT",
    UnmarkedAsDuplicateEvent = "UNMARKED_AS_DUPLICATE_EVENT",
    UnpinnedEvent = "UNPINNED_EVENT",
    UnsubscribedEvent = "UNSUBSCRIBED_EVENT",
    UserBlockedEvent = "USER_BLOCKED_EVENT",
  }
/** Properties by which discussion poll option connections can be ordered. */
  export enum DiscussionPollOptionOrderField {
    AuthoredOrder = "AUTHORED_ORDER",
    VoteCount = "VOTE_COUNT",
  }
/** The possible state reasons of a discussion. */
  export enum DiscussionStateReason {
    Duplicate = "DUPLICATE",
    Outdated = "OUTDATED",
    Reopened = "REOPENED",
    Resolved = "RESOLVED",
  }
/** The possible item types found in a timeline. */
  export enum IssueTimelineItemsItemType {
    AddedToProjectEvent = "ADDED_TO_PROJECT_EVENT",
    AssignedEvent = "ASSIGNED_EVENT",
    ClosedEvent = "CLOSED_EVENT",
    CommentDeletedEvent = "COMMENT_DELETED_EVENT",
    ConnectedEvent = "CONNECTED_EVENT",
    ConvertedNoteToIssueEvent = "CONVERTED_NOTE_TO_ISSUE_EVENT",
    ConvertedToDiscussionEvent = "CONVERTED_TO_DISCUSSION_EVENT",
    CrossReferencedEvent = "CROSS_REFERENCED_EVENT",
    DemilestonedEvent = "DEMILESTONED_EVENT",
    DisconnectedEvent = "DISCONNECTED_EVENT",
    IssueComment = "ISSUE_COMMENT",
    LabeledEvent = "LABELED_EVENT",
    LockedEvent = "LOCKED_EVENT",
    MarkedAsDuplicateEvent = "MARKED_AS_DUPLICATE_EVENT",
    MentionedEvent = "MENTIONED_EVENT",
    MilestonedEvent = "MILESTONED_EVENT",
    MovedColumnsInProjectEvent = "MOVED_COLUMNS_IN_PROJECT_EVENT",
    PinnedEvent = "PINNED_EVENT",
    ReferencedEvent = "REFERENCED_EVENT",
    RemovedFromProjectEvent = "REMOVED_FROM_PROJECT_EVENT",
    RenamedTitleEvent = "RENAMED_TITLE_EVENT",
    ReopenedEvent = "REOPENED_EVENT",
    SubscribedEvent = "SUBSCRIBED_EVENT",
    TransferredEvent = "TRANSFERRED_EVENT",
    UnassignedEvent = "UNASSIGNED_EVENT",
    UnlabeledEvent = "UNLABELED_EVENT",
    UnlockedEvent = "UNLOCKED_EVENT",
    UnmarkedAsDuplicateEvent = "UNMARKED_AS_DUPLICATE_EVENT",
    UnpinnedEvent = "UNPINNED_EVENT",
    UnsubscribedEvent = "UNSUBSCRIBED_EVENT",
    UserBlockedEvent = "USER_BLOCKED_EVENT",
  }
/** The possible states of a tracked issue. */
  export enum TrackedIssueStates {
    Closed = "CLOSED",
    Open = "OPEN",
  }
/** Various content states of a ProjectCard */
  export enum ProjectCardState {
    ContentOnly = "CONTENT_ONLY",
    NoteOnly = "NOTE_ONLY",
    Redacted = "REDACTED",
  }
/** The semantic purpose of the column - todo, in progress, or done. */
  export enum ProjectColumnPurpose {
    Done = "DONE",
    InProgress = "IN_PROGRESS",
    Todo = "TODO",
  }
/** State of the project; either 'open' or 'closed' */
  export enum ProjectState {
    Closed = "CLOSED",
    Open = "OPEN",
  }
/** Properties by which project connections can be ordered. */
  export enum ProjectOrderField {
    CreatedAt = "CREATED_AT",
    Name = "NAME",
    UpdatedAt = "UPDATED_AT",
  }
/** The possible reasons a given repository could be in a locked state. */
  export enum RepositoryLockReason {
    Billing = "BILLING",
    Migrating = "MIGRATING",
    Moving = "MOVING",
    Rename = "RENAME",
    TradeRestriction = "TRADE_RESTRICTION",
  }
/** The repository's visibility level. */
  export enum RepositoryVisibility {
    Internal = "INTERNAL",
    Private = "PRIVATE",
    Public = "PUBLIC",
  }
/** Properties by which star connections can be ordered. */
  export enum StarOrderField {
    StarredAt = "STARRED_AT",
  }
/** Collaborators affiliation level with a subject. */
  export enum CollaboratorAffiliation {
    All = "ALL",
    Direct = "DIRECT",
    Outside = "OUTSIDE",
  }
/** The possible base permissions for repositories. */
  export enum DefaultRepositoryPermissionField {
    Admin = "ADMIN",
    None = "NONE",
    Read = "READ",
    Write = "WRITE",
  }
/** Properties by which discussion connections can be ordered. */
  export enum DiscussionOrderField {
    CreatedAt = "CREATED_AT",
    UpdatedAt = "UPDATED_AT",
  }
/** The possible states of a discussion. */
  export enum DiscussionState {
    Closed = "CLOSED",
    Open = "OPEN",
  }
/** The possible funding platforms for repository funding links. */
  export enum FundingPlatform {
    CommunityBridge = "COMMUNITY_BRIDGE",
    Custom = "CUSTOM",
    Github = "GITHUB",
    Issuehunt = "ISSUEHUNT",
    KoFi = "KO_FI",
    LfxCrowdfunding = "LFX_CROWDFUNDING",
    Liberapay = "LIBERAPAY",
    OpenCollective = "OPEN_COLLECTIVE",
    Otechie = "OTECHIE",
    Patreon = "PATREON",
    Tidelift = "TIDELIFT",
  }
/** A repository interaction limit. */
  export enum RepositoryInteractionLimit {
    CollaboratorsOnly = "COLLABORATORS_ONLY",
    ContributorsOnly = "CONTRIBUTORS_ONLY",
    ExistingUsers = "EXISTING_USERS",
    NoLimit = "NO_LIMIT",
  }
/** Indicates where an interaction limit is configured. */
  export enum RepositoryInteractionLimitOrigin {
    Organization = "ORGANIZATION",
    Repository = "REPOSITORY",
    User = "USER",
  }
/** Properties by which language connections can be ordered. */
  export enum LanguageOrderField {
    Size = "SIZE",
  }
/** The possible default commit messages for merges. */
  export enum MergeCommitMessage {
    Blank = "BLANK",
    PrBody = "PR_BODY",
    PrTitle = "PR_TITLE",
  }
/** The possible default commit titles for merges. */
  export enum MergeCommitTitle {
    MergeMessage = "MERGE_MESSAGE",
    PrTitle = "PR_TITLE",
  }
/** Properties by which milestone connections can be ordered. */
  export enum MilestoneOrderField {
    CreatedAt = "CREATED_AT",
    DueDate = "DUE_DATE",
    Number = "NUMBER",
    UpdatedAt = "UPDATED_AT",
  }
/** Preconfigured background patterns that may be used to style discussions pinned within a repository. */
  export enum PinnedDiscussionPattern {
    ChevronUp = "CHEVRON_UP",
    Dot = "DOT",
    DotFill = "DOT_FILL",
    HeartFill = "HEART_FILL",
    Plus = "PLUS",
    Zap = "ZAP",
  }
/** Preconfigured gradients that may be used to style discussions pinned within a repository. */
  export enum PinnedDiscussionGradient {
    BlueMint = "BLUE_MINT",
    BluePurple = "BLUE_PURPLE",
    PinkBlue = "PINK_BLUE",
    PurpleCoral = "PURPLE_CORAL",
    RedOrange = "RED_ORANGE",
  }
/** Properties by which ref connections can be ordered. */
  export enum RefOrderField {
    Alphabetical = "ALPHABETICAL",
    TagCommitDate = "TAG_COMMIT_DATE",
  }
/** Properties by which release connections can be ordered. */
  export enum ReleaseOrderField {
    CreatedAt = "CREATED_AT",
    Name = "NAME",
  }
/** The bypass mode for a rule or ruleset. */
  export enum RuleBypassMode {
    None = "NONE",
    Organization = "ORGANIZATION",
    Repository = "REPOSITORY",
  }
/** The level of enforcement for a rule or ruleset. */
  export enum RuleEnforcement {
    Active = "ACTIVE",
    Disabled = "DISABLED",
    Evaluate = "EVALUATE",
  }
/** The rule types supported in rulesets */
  export enum RepositoryRuleType {
    BranchNamePattern = "BRANCH_NAME_PATTERN",
    CommitAuthorEmailPattern = "COMMIT_AUTHOR_EMAIL_PATTERN",
    CommitMessagePattern = "COMMIT_MESSAGE_PATTERN",
    CommitterEmailPattern = "COMMITTER_EMAIL_PATTERN",
    Creation = "CREATION",
    Deletion = "DELETION",
    NonFastForward = "NON_FAST_FORWARD",
    PullRequest = "PULL_REQUEST",
    RequiredDeployments = "REQUIRED_DEPLOYMENTS",
    RequiredLinearHistory = "REQUIRED_LINEAR_HISTORY",
    RequiredSignatures = "REQUIRED_SIGNATURES",
    RequiredStatusChecks = "REQUIRED_STATUS_CHECKS",
    TagNamePattern = "TAG_NAME_PATTERN",
    Update = "UPDATE",
  }
/** The targets supported for rulesets */
  export enum RepositoryRulesetTarget {
    Branch = "BRANCH",
    Tag = "TAG",
  }
/** The possible default commit messages for squash merges. */
  export enum SquashMergeCommitMessage {
    Blank = "BLANK",
    CommitMessages = "COMMIT_MESSAGES",
    PrBody = "PR_BODY",
  }
/** The possible default commit titles for squash merges. */
  export enum SquashMergeCommitTitle {
    CommitOrPrTitle = "COMMIT_OR_PR_TITLE",
    PrTitle = "PR_TITLE",
  }
/** The possible scopes of an alert's dependency. */
  export enum RepositoryVulnerabilityAlertDependencyScope {
    Development = "DEVELOPMENT",
    Runtime = "RUNTIME",
  }
/** Classification of the advisory. */
  export enum SecurityAdvisoryClassification {
    General = "GENERAL",
    Malware = "MALWARE",
  }
/** Severity of the vulnerability. */
  export enum SecurityAdvisorySeverity {
    Critical = "CRITICAL",
    High = "HIGH",
    Low = "LOW",
    Moderate = "MODERATE",
  }
/** The possible ecosystems of a security vulnerability's package. */
  export enum SecurityAdvisoryEcosystem {
    Actions = "ACTIONS",
    Composer = "COMPOSER",
    Erlang = "ERLANG",
    Go = "GO",
    Maven = "MAVEN",
    Npm = "NPM",
    Nuget = "NUGET",
    Pip = "PIP",
    Pub = "PUB",
    Rubygems = "RUBYGEMS",
    Rust = "RUST",
  }
/** Properties by which security vulnerability connections can be ordered. */
  export enum SecurityVulnerabilityOrderField {
    UpdatedAt = "UPDATED_AT",
  }
/** The possible states of an alert */
  export enum RepositoryVulnerabilityAlertState {
    AutoDismissed = "AUTO_DISMISSED",
    Dismissed = "DISMISSED",
    Fixed = "FIXED",
    Open = "OPEN",
  }
/** Properties by which package version connections can be ordered. */
  export enum PackageVersionOrderField {
    CreatedAt = "CREATED_AT",
  }
/** Represents items that can be pinned to a profile page or dashboard. */
  export enum PinnableItemType {
    Gist = "GIST",
    Issue = "ISSUE",
    Organization = "ORGANIZATION",
    Project = "PROJECT",
    PullRequest = "PULL_REQUEST",
    Repository = "REPOSITORY",
    Team = "TEAM",
    User = "USER",
  }
/** Properties by which gist connections can be ordered. */
  export enum GistOrderField {
    CreatedAt = "CREATED_AT",
    PushedAt = "PUSHED_AT",
    UpdatedAt = "UPDATED_AT",
  }
/** Properties by which sponsor connections can be ordered. */
  export enum SponsorOrderField {
    Login = "LOGIN",
    Relevance = "RELEVANCE",
  }
/** The possible actions that GitHub Sponsors activities can represent. */
  export enum SponsorsActivityAction {
    CancelledSponsorship = "CANCELLED_SPONSORSHIP",
    NewSponsorship = "NEW_SPONSORSHIP",
    PendingChange = "PENDING_CHANGE",
    Refund = "REFUND",
    SponsorMatchDisabled = "SPONSOR_MATCH_DISABLED",
    TierChange = "TIER_CHANGE",
  }
/** Properties by which GitHub Sponsors activity connections can be ordered. */
  export enum SponsorsActivityOrderField {
    Timestamp = "TIMESTAMP",
  }
/** The possible time periods for which Sponsors activities can be requested. */
  export enum SponsorsActivityPeriod {
    All = "ALL",
    Day = "DAY",
    Month = "MONTH",
    Week = "WEEK",
  }
/** Properties by which sponsorship connections can be ordered. */
  export enum SponsorshipOrderField {
    CreatedAt = "CREATED_AT",
  }
/** The privacy of a sponsorship */
  export enum SponsorshipPrivacy {
    Private = "PRIVATE",
    Public = "PUBLIC",
  }
/** The different kinds of goals a GitHub Sponsors member can have. */
  export enum SponsorsGoalKind {
    MonthlySponsorshipAmount = "MONTHLY_SPONSORSHIP_AMOUNT",
    TotalSponsorsCount = "TOTAL_SPONSORS_COUNT",
  }
/** The different kinds of records that can be featured on a GitHub Sponsors profile page. */
  export enum SponsorsListingFeaturedItemFeatureableType {
    Repository = "REPOSITORY",
    User = "USER",
  }
/** Properties by which Sponsors tiers connections can be ordered. */
  export enum SponsorsTierOrderField {
    CreatedAt = "CREATED_AT",
    MonthlyPriceInCents = "MONTHLY_PRICE_IN_CENTS",
  }
/** Properties by which sponsorship update connections can be ordered. */
  export enum SponsorshipNewsletterOrderField {
    CreatedAt = "CREATED_AT",
  }
/** Properties by which commit contribution connections can be ordered. */
  export enum CommitContributionOrderField {
    CommitCount = "COMMIT_COUNT",
    OccurredAt = "OCCURRED_AT",
  }
/** Varying levels of contributions from none to many. */
  export enum ContributionLevel {
    FirstQuartile = "FIRST_QUARTILE",
    FourthQuartile = "FOURTH_QUARTILE",
    None = "NONE",
    SecondQuartile = "SECOND_QUARTILE",
    ThirdQuartile = "THIRD_QUARTILE",
  }
/** The privacy of a Gist */
  export enum GistPrivacy {
    All = "ALL",
    Public = "PUBLIC",
    Secret = "SECRET",
  }
/** The reason a repository is listed as 'contributed'. */
  export enum RepositoryContributionType {
    Commit = "COMMIT",
    Issue = "ISSUE",
    PullRequest = "PULL_REQUEST",
    PullRequestReview = "PULL_REQUEST_REVIEW",
    Repository = "REPOSITORY",
  }
/** Properties by which saved reply connections can be ordered. */
  export enum SavedReplyOrderField {
    UpdatedAt = "UPDATED_AT",
  }
/** Software or company that hosts social media accounts. */
  export enum SocialAccountProvider {
    Facebook = "FACEBOOK",
    Generic = "GENERIC",
    Hometown = "HOMETOWN",
    Instagram = "INSTAGRAM",
    Linkedin = "LINKEDIN",
    Mastodon = "MASTODON",
    Reddit = "REDDIT",
    Twitch = "TWITCH",
    Twitter = "TWITTER",
    Youtube = "YOUTUBE",
  }
/** Properties by which Audit Log connections can be ordered. */
  export enum AuditLogOrderField {
    CreatedAt = "CREATED_AT",
  }
/** The corresponding operation type for the action */
  export enum OperationType {
    Access = "ACCESS",
    Authentication = "AUTHENTICATION",
    Create = "CREATE",
    Modify = "MODIFY",
    Remove = "REMOVE",
    Restore = "RESTORE",
    Transfer = "TRANSFER",
  }
/** The state of an OAuth Application when it was created. */
  export enum OauthApplicationCreateAuditEntryState {
    Active = "ACTIVE",
    PendingDeletion = "PENDING_DELETION",
    Suspended = "SUSPENDED",
  }
/** The permissions available to members on an Organization. */
  export enum OrgAddMemberAuditEntryPermission {
    Admin = "ADMIN",
    Read = "READ",
  }
/** The billing plans available for organizations. */
  export enum OrgCreateAuditEntryBillingPlan {
    Business = "BUSINESS",
    BusinessPlus = "BUSINESS_PLUS",
    Free = "FREE",
    TieredPerSeat = "TIERED_PER_SEAT",
    Unlimited = "UNLIMITED",
  }
/** The reason a billing manager was removed from an Organization. */
  export enum OrgRemoveBillingManagerAuditEntryReason {
    SamlExternalIdentityMissing = "SAML_EXTERNAL_IDENTITY_MISSING",
    SamlSsoEnforcementRequiresExternalIdentity = "SAML_SSO_ENFORCEMENT_REQUIRES_EXTERNAL_IDENTITY",
    TwoFactorRequirementNonCompliance = "TWO_FACTOR_REQUIREMENT_NON_COMPLIANCE",
  }
/** The type of membership a user has with an Organization. */
  export enum OrgRemoveMemberAuditEntryMembershipType {
    Admin = "ADMIN",
    BillingManager = "BILLING_MANAGER",
    DirectMember = "DIRECT_MEMBER",
    OutsideCollaborator = "OUTSIDE_COLLABORATOR",
    Suspended = "SUSPENDED",
    Unaffiliated = "UNAFFILIATED",
  }
/** The reason a member was removed from an Organization. */
  export enum OrgRemoveMemberAuditEntryReason {
    SamlExternalIdentityMissing = "SAML_EXTERNAL_IDENTITY_MISSING",
    SamlSsoEnforcementRequiresExternalIdentity = "SAML_SSO_ENFORCEMENT_REQUIRES_EXTERNAL_IDENTITY",
    TwoFactorAccountRecovery = "TWO_FACTOR_ACCOUNT_RECOVERY",
    TwoFactorRequirementNonCompliance = "TWO_FACTOR_REQUIREMENT_NON_COMPLIANCE",
    UserAccountDeleted = "USER_ACCOUNT_DELETED",
  }
/** The type of membership a user has with an Organization. */
  export enum OrgRemoveOutsideCollaboratorAuditEntryMembershipType {
    BillingManager = "BILLING_MANAGER",
    OutsideCollaborator = "OUTSIDE_COLLABORATOR",
    Unaffiliated = "UNAFFILIATED",
  }
/** The reason an outside collaborator was removed from an Organization. */
  export enum OrgRemoveOutsideCollaboratorAuditEntryReason {
    SamlExternalIdentityMissing = "SAML_EXTERNAL_IDENTITY_MISSING",
    TwoFactorRequirementNonCompliance = "TWO_FACTOR_REQUIREMENT_NON_COMPLIANCE",
  }
/** The default permission a repository can have in an Organization. */
  export enum OrgUpdateDefaultRepositoryPermissionAuditEntryPermission {
    Admin = "ADMIN",
    None = "NONE",
    Read = "READ",
    Write = "WRITE",
  }
/** The permissions available to members on an Organization. */
  export enum OrgUpdateMemberAuditEntryPermission {
    Admin = "ADMIN",
    Read = "READ",
  }
/** The permissions available for repository creation on an Organization. */
  export enum OrgUpdateMemberRepositoryCreationPermissionAuditEntryVisibility {
    All = "ALL",
    Internal = "INTERNAL",
    None = "NONE",
    Private = "PRIVATE",
    PrivateInternal = "PRIVATE_INTERNAL",
    Public = "PUBLIC",
    PublicInternal = "PUBLIC_INTERNAL",
    PublicPrivate = "PUBLIC_PRIVATE",
  }
/** The privacy of a repository */
  export enum RepoAccessAuditEntryVisibility {
    Internal = "INTERNAL",
    Private = "PRIVATE",
    Public = "PUBLIC",
  }
/** The privacy of a repository */
  export enum RepoAddMemberAuditEntryVisibility {
    Internal = "INTERNAL",
    Private = "PRIVATE",
    Public = "PUBLIC",
  }
/** The privacy of a repository */
  export enum RepoArchivedAuditEntryVisibility {
    Internal = "INTERNAL",
    Private = "PRIVATE",
    Public = "PUBLIC",
  }
/** The merge options available for pull requests to this repository. */
  export enum RepoChangeMergeSettingAuditEntryMergeType {
    Merge = "MERGE",
    Rebase = "REBASE",
    Squash = "SQUASH",
  }
/** The privacy of a repository */
  export enum RepoCreateAuditEntryVisibility {
    Internal = "INTERNAL",
    Private = "PRIVATE",
    Public = "PUBLIC",
  }
/** The privacy of a repository */
  export enum RepoDestroyAuditEntryVisibility {
    Internal = "INTERNAL",
    Private = "PRIVATE",
    Public = "PUBLIC",
  }
/** The privacy of a repository */
  export enum RepoRemoveMemberAuditEntryVisibility {
    Internal = "INTERNAL",
    Private = "PRIVATE",
    Public = "PUBLIC",
  }
/** Properties by which verifiable domain connections can be ordered. */
  export enum VerifiableDomainOrderField {
    CreatedAt = "CREATED_AT",
    Domain = "DOMAIN",
  }
/** Properties by which enterprise owners can be ordered. */
  export enum OrgEnterpriseOwnerOrderField {
    Login = "LOGIN",
  }
/** Possible roles a user may have in relation to an organization. */
  export enum RoleInOrganization {
    DirectMember = "DIRECT_MEMBER",
    Owner = "OWNER",
    Unaffiliated = "UNAFFILIATED",
  }
/** The possible values for the IP allow list enabled setting. */
  export enum IpAllowListEnabledSettingValue {
    Disabled = "DISABLED",
    Enabled = "ENABLED",
  }
/** The possible values for the IP allow list configuration for installed GitHub Apps setting. */
  export enum IpAllowListForInstalledAppsEnabledSettingValue {
    Disabled = "DISABLED",
    Enabled = "ENABLED",
  }
/** Properties by which mannequins can be ordered. */
  export enum MannequinOrderField {
    CreatedAt = "CREATED_AT",
    Login = "LOGIN",
  }
/** The possible roles within an organization for its members. */
  export enum OrganizationMemberRole {
    Admin = "ADMIN",
    Member = "MEMBER",
  }
/** The possible values for the notification restriction setting. */
  export enum NotificationRestrictionSettingValue {
    Disabled = "DISABLED",
    Enabled = "ENABLED",
  }
/** Possible directions in which to order a list of repository migrations when provided an `orderBy` argument. */
  export enum RepositoryMigrationOrderDirection {
    Asc = "ASC",
    Desc = "DESC",
  }
/** Properties by which repository migrations can be ordered. */
  export enum RepositoryMigrationOrderField {
    CreatedAt = "CREATED_AT",
  }
/** The GitHub Enterprise Importer (GEI) migration state. */
  export enum MigrationState {
    Failed = "FAILED",
    FailedValidation = "FAILED_VALIDATION",
    InProgress = "IN_PROGRESS",
    NotStarted = "NOT_STARTED",
    PendingValidation = "PENDING_VALIDATION",
    Queued = "QUEUED",
    Succeeded = "SUCCEEDED",
  }
/** Represents the different GitHub Enterprise Importer (GEI) migration sources. */
  export enum MigrationSourceType {
    AzureDevops = "AZURE_DEVOPS",
    BitbucketServer = "BITBUCKET_SERVER",
    GithubArchive = "GITHUB_ARCHIVE",
  }
/** The role of a user on a team. */
  export enum TeamRole {
    Admin = "ADMIN",
    Member = "MEMBER",
  }
/** The possible administrator roles in an enterprise account. */
  export enum EnterpriseAdministratorRole {
    BillingManager = "BILLING_MANAGER",
    Owner = "OWNER",
  }
/** The possible values for an enabled/disabled enterprise setting. */
  export enum EnterpriseEnabledDisabledSettingValue {
    Disabled = "DISABLED",
    Enabled = "ENABLED",
    NoPolicy = "NO_POLICY",
  }
/** The possible values for the enterprise allow private repository forking policy value. */
  export enum EnterpriseAllowPrivateRepositoryForkingPolicyValue {
    EnterpriseOrganizations = "ENTERPRISE_ORGANIZATIONS",
    EnterpriseOrganizationsUserAccounts = "ENTERPRISE_ORGANIZATIONS_USER_ACCOUNTS",
    Everywhere = "EVERYWHERE",
    SameOrganization = "SAME_ORGANIZATION",
    SameOrganizationUserAccounts = "SAME_ORGANIZATION_USER_ACCOUNTS",
    UserAccounts = "USER_ACCOUNTS",
  }
/** The possible values for the enterprise base repository permission setting. */
  export enum EnterpriseDefaultRepositoryPermissionSettingValue {
    Admin = "ADMIN",
    NoPolicy = "NO_POLICY",
    None = "NONE",
    Read = "READ",
    Write = "WRITE",
  }
/** The possible values for the enterprise members can create repositories setting. */
  export enum EnterpriseMembersCanCreateRepositoriesSettingValue {
    All = "ALL",
    Disabled = "DISABLED",
    NoPolicy = "NO_POLICY",
    Private = "PRIVATE",
    Public = "PUBLIC",
  }
/** The possible values for the members can create repositories setting on an organization. */
  export enum OrganizationMembersCanCreateRepositoriesSettingValue {
    All = "ALL",
    Disabled = "DISABLED",
    Internal = "INTERNAL",
    Private = "PRIVATE",
  }
/** The possible values for the members can make purchases setting. */
  export enum EnterpriseMembersCanMakePurchasesSettingValue {
    Disabled = "DISABLED",
    Enabled = "ENABLED",
  }
/** The OIDC identity provider type */
  export enum OidcProviderType {
    Aad = "AAD",
  }
/** Properties by which enterprise administrator invitation connections can be ordered. */
  export enum EnterpriseAdministratorInvitationOrderField {
    CreatedAt = "CREATED_AT",
  }
/** Properties by which repository invitation connections can be ordered. */
  export enum RepositoryInvitationOrderField {
    CreatedAt = "CREATED_AT",
  }
/** The possible digest algorithms used to sign SAML requests for an identity provider. */
  export enum SamlDigestAlgorithm {
    Sha1 = "SHA1",
    Sha256 = "SHA256",
    Sha384 = "SHA384",
    Sha512 = "SHA512",
  }
/** The possible signature algorithms used to sign SAML requests for a Identity Provider. */
  export enum SamlSignatureAlgorithm {
    RsaSha1 = "RSA_SHA1",
    RsaSha256 = "RSA_SHA256",
    RsaSha384 = "RSA_SHA384",
    RsaSha512 = "RSA_SHA512",
  }
/** The possible states in which authentication can be configured with an identity provider. */
  export enum IdentityProviderConfigurationState {
    Configured = "CONFIGURED",
    Enforced = "ENFORCED",
    Unconfigured = "UNCONFIGURED",
  }
/** The possible values for an enabled/no policy enterprise setting. */
  export enum EnterpriseEnabledSettingValue {
    Enabled = "ENABLED",
    NoPolicy = "NO_POLICY",
  }
/** Represents the individual results of a search. */
  export enum SearchType {
    Discussion = "DISCUSSION",
    Issue = "ISSUE",
    Repository = "REPOSITORY",
    User = "USER",
  }
/** Identifier formats available for advisories. */
  export enum SecurityAdvisoryIdentifierType {
    Cve = "CVE",
    Ghsa = "GHSA",
  }
/** Properties by which security advisory connections can be ordered. */
  export enum SecurityAdvisoryOrderField {
    PublishedAt = "PUBLISHED_AT",
    UpdatedAt = "UPDATED_AT",
  }
/** The possible ecosystems of a dependency graph package. */
  export enum DependencyGraphEcosystem {
    Actions = "ACTIONS",
    Composer = "COMPOSER",
    Go = "GO",
    Maven = "MAVEN",
    Npm = "NPM",
    Nuget = "NUGET",
    Pip = "PIP",
    Pub = "PUB",
    Rubygems = "RUBYGEMS",
    Rust = "RUST",
  }
/** Properties by which sponsorable connections can be ordered. */
  export enum SponsorableOrderField {
    Login = "LOGIN",
  }
/** The possible events to perform on a pull request review. */
  export enum PullRequestReviewEvent {
    Approve = "APPROVE",
    Comment = "COMMENT",
    Dismiss = "DISMISS",
    RequestChanges = "REQUEST_CHANGES",
  }
/** The possible reasons for closing a discussion. */
  export enum DiscussionCloseReason {
    Duplicate = "DUPLICATE",
    Outdated = "OUTDATED",
    Resolved = "RESOLVED",
  }
/** The possible state reasons of a closed issue. */
  export enum IssueClosedStateReason {
    Completed = "COMPLETED",
    NotPlanned = "NOT_PLANNED",
  }
/** The possible states that can be requested when creating a check run. */
  export enum RequestableCheckStatusState {
    Completed = "COMPLETED",
    InProgress = "IN_PROGRESS",
    Pending = "PENDING",
    Queued = "QUEUED",
    Waiting = "WAITING",
  }
/** GitHub-provided templates for Projects */
  export enum ProjectTemplate {
    AutomatedKanbanV2 = "AUTOMATED_KANBAN_V2",
    AutomatedReviewsKanban = "AUTOMATED_REVIEWS_KANBAN",
    BasicKanban = "BASIC_KANBAN",
    BugTriage = "BUG_TRIAGE",
  }
/** The type of a project field. */
  export enum ProjectV2CustomFieldType {
    Date = "DATE",
    Number = "NUMBER",
    SingleSelect = "SINGLE_SELECT",
    Text = "TEXT",
  }
/** The display color of a single-select field option. */
  export enum ProjectV2SingleSelectFieldOptionColor {
    Blue = "BLUE",
    Gray = "GRAY",
    Green = "GREEN",
    Orange = "ORANGE",
    Pink = "PINK",
    Purple = "PURPLE",
    Red = "RED",
    Yellow = "YELLOW",
  }
/** Represents countries or regions for billing and residence for a GitHub Sponsors profile. */
  export enum SponsorsCountryOrRegionCode {
    Ad = "AD",
    Ae = "AE",
    Af = "AF",
    Ag = "AG",
    Ai = "AI",
    Al = "AL",
    Am = "AM",
    Ao = "AO",
    Aq = "AQ",
    Ar = "AR",
    As = "AS",
    At = "AT",
    Au = "AU",
    Aw = "AW",
    Ax = "AX",
    Az = "AZ",
    Ba = "BA",
    Bb = "BB",
    Bd = "BD",
    Be = "BE",
    Bf = "BF",
    Bg = "BG",
    Bh = "BH",
    Bi = "BI",
    Bj = "BJ",
    Bl = "BL",
    Bm = "BM",
    Bn = "BN",
    Bo = "BO",
    Bq = "BQ",
    Br = "BR",
    Bs = "BS",
    Bt = "BT",
    Bv = "BV",
    Bw = "BW",
    By = "BY",
    Bz = "BZ",
    Ca = "CA",
    Cc = "CC",
    Cd = "CD",
    Cf = "CF",
    Cg = "CG",
    Ch = "CH",
    Ci = "CI",
    Ck = "CK",
    Cl = "CL",
    Cm = "CM",
    Cn = "CN",
    Co = "CO",
    Cr = "CR",
    Cv = "CV",
    Cw = "CW",
    Cx = "CX",
    Cy = "CY",
    Cz = "CZ",
    De = "DE",
    Dj = "DJ",
    Dk = "DK",
    Dm = "DM",
    Do = "DO",
    Dz = "DZ",
    Ec = "EC",
    Ee = "EE",
    Eg = "EG",
    Eh = "EH",
    Er = "ER",
    Es = "ES",
    Et = "ET",
    Fi = "FI",
    Fj = "FJ",
    Fk = "FK",
    Fm = "FM",
    Fo = "FO",
    Fr = "FR",
    Ga = "GA",
    Gb = "GB",
    Gd = "GD",
    Ge = "GE",
    Gf = "GF",
    Gg = "GG",
    Gh = "GH",
    Gi = "GI",
    Gl = "GL",
    Gm = "GM",
    Gn = "GN",
    Gp = "GP",
    Gq = "GQ",
    Gr = "GR",
    Gs = "GS",
    Gt = "GT",
    Gu = "GU",
    Gw = "GW",
    Gy = "GY",
    Hk = "HK",
    Hm = "HM",
    Hn = "HN",
    Hr = "HR",
    Ht = "HT",
    Hu = "HU",
    Id = "ID",
    Ie = "IE",
    Il = "IL",
    Im = "IM",
    In = "IN",
    Io = "IO",
    Iq = "IQ",
    Ir = "IR",
    Is = "IS",
    It = "IT",
    Je = "JE",
    Jm = "JM",
    Jo = "JO",
    Jp = "JP",
    Ke = "KE",
    Kg = "KG",
    Kh = "KH",
    Ki = "KI",
    Km = "KM",
    Kn = "KN",
    Kr = "KR",
    Kw = "KW",
    Ky = "KY",
    Kz = "KZ",
    La = "LA",
    Lb = "LB",
    Lc = "LC",
    Li = "LI",
    Lk = "LK",
    Lr = "LR",
    Ls = "LS",
    Lt = "LT",
    Lu = "LU",
    Lv = "LV",
    Ly = "LY",
    Ma = "MA",
    Mc = "MC",
    Md = "MD",
    Me = "ME",
    Mf = "MF",
    Mg = "MG",
    Mh = "MH",
    Mk = "MK",
    Ml = "ML",
    Mm = "MM",
    Mn = "MN",
    Mo = "MO",
    Mp = "MP",
    Mq = "MQ",
    Mr = "MR",
    Ms = "MS",
    Mt = "MT",
    Mu = "MU",
    Mv = "MV",
    Mw = "MW",
    Mx = "MX",
    My = "MY",
    Mz = "MZ",
    Na = "NA",
    Nc = "NC",
    Ne = "NE",
    Nf = "NF",
    Ng = "NG",
    Ni = "NI",
    Nl = "NL",
    No = "NO",
    Np = "NP",
    Nr = "NR",
    Nu = "NU",
    Nz = "NZ",
    Om = "OM",
    Pa = "PA",
    Pe = "PE",
    Pf = "PF",
    Pg = "PG",
    Ph = "PH",
    Pk = "PK",
    Pl = "PL",
    Pm = "PM",
    Pn = "PN",
    Pr = "PR",
    Ps = "PS",
    Pt = "PT",
    Pw = "PW",
    Py = "PY",
    Qa = "QA",
    Re = "RE",
    Ro = "RO",
    Rs = "RS",
    Ru = "RU",
    Rw = "RW",
    Sa = "SA",
    Sb = "SB",
    Sc = "SC",
    Sd = "SD",
    Se = "SE",
    Sg = "SG",
    Sh = "SH",
    Si = "SI",
    Sj = "SJ",
    Sk = "SK",
    Sl = "SL",
    Sm = "SM",
    Sn = "SN",
    So = "SO",
    Sr = "SR",
    Ss = "SS",
    St = "ST",
    Sv = "SV",
    Sx = "SX",
    Sz = "SZ",
    Tc = "TC",
    Td = "TD",
    Tf = "TF",
    Tg = "TG",
    Th = "TH",
    Tj = "TJ",
    Tk = "TK",
    Tl = "TL",
    Tm = "TM",
    Tn = "TN",
    To = "TO",
    Tr = "TR",
    Tt = "TT",
    Tv = "TV",
    Tw = "TW",
    Tz = "TZ",
    Ua = "UA",
    Ug = "UG",
    Um = "UM",
    Us = "US",
    Uy = "UY",
    Uz = "UZ",
    Va = "VA",
    Vc = "VC",
    Ve = "VE",
    Vg = "VG",
    Vi = "VI",
    Vn = "VN",
    Vu = "VU",
    Wf = "WF",
    Ws = "WS",
    Ye = "YE",
    Yt = "YT",
    Za = "ZA",
    Zm = "ZM",
    Zw = "ZW",
  }
/** Reason that the suggested topic is declined. */
  export enum TopicSuggestionDeclineReason {
    NotRelevant = "NOT_RELEVANT",
    PersonalPreference = "PERSONAL_PREFERENCE",
    TooGeneral = "TOO_GENERAL",
    TooSpecific = "TOO_SPECIFIC",
  }
/** The possible reasons that a Dependabot alert was dismissed. */
  export enum DismissReason {
    FixStarted = "FIX_STARTED",
    Inaccurate = "INACCURATE",
    NoBandwidth = "NO_BANDWIDTH",
    NotUsed = "NOT_USED",
    TolerableRisk = "TOLERABLE_RISK",
  }
/** The actor's type. */
  export enum ActorType {
    Team = "TEAM",
    User = "USER",
  }
/** The reasons a piece of content can be reported or minimized. */
  export enum ReportedContentClassifiers {
    Abuse = "ABUSE",
    Duplicate = "DUPLICATE",
    OffTopic = "OFF_TOPIC",
    Outdated = "OUTDATED",
    Resolved = "RESOLVED",
    Spam = "SPAM",
  }
/** The length for a repository interaction limit to be enabled for. */
  export enum RepositoryInteractionLimitExpiry {
    OneDay = "ONE_DAY",
    OneMonth = "ONE_MONTH",
    OneWeek = "ONE_WEEK",
    SixMonths = "SIX_MONTHS",
    ThreeDays = "THREE_DAYS",
  }
/** The Octoshift Organization migration state. */
  export enum OrganizationMigrationState {
    Failed = "FAILED",
    InProgress = "IN_PROGRESS",
    NotStarted = "NOT_STARTED",
    PostRepoMigration = "POST_REPO_MIGRATION",
    PreRepoMigration = "PRE_REPO_MIGRATION",
    Queued = "QUEUED",
    RepoMigration = "REPO_MIGRATION",
    Succeeded = "SUCCEEDED",
  }
/** The possible target states when updating a pull request. */
  export enum PullRequestUpdateState {
    Closed = "CLOSED",
    Open = "OPEN",
  }

/** An RFC 3986, RFC 3987, and RFC 6570 (level 4) compliant URI string. */
export type Uri = any;

/** An ISO-8601 encoded UTC date string. */
export type DateTime = any;

/** A string containing HTML code. */
export type Html = any;

/** An ISO-8601 encoded date string. */
export type Date = any;

/** A Git object ID. */
export type GitObjectId = any;

/** An ISO-8601 encoded date string. Unlike the DateTime type, GitTimestamp is not converted in UTC. */
export type GitTimestamp = any;

/** A (potentially binary) string encoded using base64. */
export type Base64String = any;

/** Represents non-fractional signed whole numeric values. Since the value may exceed the size of a 32-bit integer, it's encoded as a string. */
export type BigInt = any;

/** Git SSH string */
export type GitSshRemote = any;

/** An ISO-8601 encoded UTC date string with millisecond precision. */
export type PreciseDateTime = any;

/** A valid x509 certificate string */
export type X509Certificate = any;

/** A fully qualified reference name (e.g. `refs/heads/master`). */
export type GitRefname = any;

export type GetCheckRunsQueryVariables = Exact<{
  owner: Scalars['String']['input'];
  repo: Scalars['String']['input'];
  commitSha: Scalars['String']['input'];
}>;


export type GetCheckRunsQuery = { __typename?: 'Query', repository?: { __typename?: 'Repository', object?: { __typename?: 'Commit', checkSuites?: { __typename?: 'CheckSuiteConnection', edges?: Array<{ __typename?: 'CheckSuiteEdge', node?: { __typename?: 'CheckSuite', id: string, status: CheckStatusState, conclusion?: CheckConclusionState | null, workflowRun?: { __typename?: 'WorkflowRun', id: string, databaseId?: number | null, createdAt: any, workflow: { __typename?: 'Workflow', id: string, databaseId?: number | null, name: string, resourcePath: any, url: any } } | null, checkRuns?: { __typename?: 'CheckRunConnection', edges?: Array<{ __typename?: 'CheckRunEdge', node?: { __typename?: 'CheckRun', id: string, databaseId?: number | null, name: string, status: CheckStatusState, conclusion?: CheckConclusionState | null, startedAt?: any | null, completedAt?: any | null } | null } | null> | null } | null } | null } | null> | null } | null } | { __typename?: 'Tree' } | { __typename?: 'Blob' } | { __typename?: 'Tag' } | null } | null };


export const GetCheckRunsDocument = gql`
    query GetCheckRuns($owner: String!, $repo: String!, $commitSha: String!) {
  repository(owner: $owner, name: $repo) {
    object(expression: $commitSha) {
      ... on Commit {
        checkSuites(first: 10) {
          edges {
            node {
              id
              status
              conclusion
              workflowRun {
                id
                databaseId
                createdAt
                workflow {
                  id
                  databaseId
                  name
                  resourcePath
                  url
                }
              }
              checkRuns(first: 10) {
                edges {
                  node {
                    id
                    databaseId
                    name
                    status
                    conclusion
                    startedAt
                    completedAt
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetCheckRuns(variables: GetCheckRunsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetCheckRunsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCheckRunsQuery>(GetCheckRunsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetCheckRuns', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;