export type IntegrationTool = {
  name: string
  description: string
  category: string
}

export type Integration = {
  id: string
  name: string
  description: string
  icon: string
  connectUrl: string
  externalUrl: string
  tools: Array<IntegrationTool>
}

export const AVAILABLE_INTEGRATIONS: Array<Integration> = [
  {
    id: 'linear',
    name: 'Linear',
    description: 'Project management and issue tracking for modern software teams',
    icon: '/integration-icons/linear.png',
    connectUrl: '/api/auth/linear/connect',
    externalUrl: 'https://linear.app',
    tools: [
      {
        name: 'Create Issue',
        description: 'Create a new Linear issue',
        category: 'Issue Management'
      },
      {
        name: 'List Issues',
        description: 'List issues in the user\'s Linear workspace',
        category: 'Issue Management'
      },
      {
        name: 'Get Issue',
        description: 'Retrieve a Linear issue details by ID, including attachments and git branch name',
        category: 'Issue Management'
      },
      {
        name: 'Update Issue',
        description: 'Update an existing Linear issue',
        category: 'Issue Management'
      },
      {
        name: 'List My Issues',
        description: 'List issues assigned to the current user',
        category: 'Issue Management'
      },
      {
        name: 'List Issue Statuses',
        description: 'List available issues statuses in a Linear team',
        category: 'Issue Management'
      },
      {
        name: 'Get Issue Status',
        description: 'Retrieve details of a specific issue status in Linear by name or ID',
        category: 'Issue Management'
      },
      {
        name: 'List Issue Labels',
        description: 'List available issue labels in a Linear team',
        category: 'Issue Management'
      },
      {
        name: 'Create Comment',
        description: 'Create a comment on a Linear issue by ID',
        category: 'Collaboration'
      },
      {
        name: 'List Comments',
        description: 'Retrieve comments for a Linear issue by ID',
        category: 'Collaboration'
      },
      {
        name: 'List Projects',
        description: 'List projects in the user\'s Linear workspace',
        category: 'Project Management'
      },
      {
        name: 'Get Project',
        description: 'Retrieve details of a specific project in Linear',
        category: 'Project Management'
      },
      {
        name: 'Create Project',
        description: 'Create a new project in Linear',
        category: 'Project Management'
      },
      {
        name: 'Update Project',
        description: 'Update an existing Linear project',
        category: 'Project Management'
      },
      {
        name: 'List Teams',
        description: 'List teams in the user\'s Linear workspace',
        category: 'Team Management'
      },
      {
        name: 'Get Team',
        description: 'Retrieve details of a specific Linear team',
        category: 'Team Management'
      },
      {
        name: 'List Users',
        description: 'Retrieve users in the Linear workspace',
        category: 'User Management'
      },
      {
        name: 'Get User',
        description: 'Retrieve details of a specific Linear user',
        category: 'User Management'
      },
      {
        name: 'List Documents',
        description: 'List documents in the user\'s Linear workspace',
        category: 'Documentation'
      },
      {
        name: 'Get Document',
        description: 'Retrieve a Linear document by ID or slug',
        category: 'Documentation'
      },
      {
        name: 'Search Documentation',
        description: 'Search Linear\'s documentation to learn about features and usage',
        category: 'Documentation'
      }
    ]
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'All-in-one workspace for notes, tasks, wikis, and databases',
    icon: '/integration-icons/notion.png',
    connectUrl: '/api/auth/notion/connect',
    externalUrl: 'https://notion.so',
    tools: [
      {
        name: 'Update Page',
        description: 'Edit existing pages by changing their title, content, or other properties',
        category: 'Page Management'
      },
      {
        name: 'View',
        description: 'Look at any page, database, file, or user in your Notion workspace to see what\'s inside',
        category: 'Content Access'
      },
      {
        name: 'Get Comments',
        description: 'Lists all comments on a specific page or block, including threaded discussions',
        category: 'Collaboration'
      },
      {
        name: 'Get Users',
        description: 'Lists all users in the workspace with their details',
        category: 'User Management'
      },
      {
        name: 'Get User',
        description: 'Gets detailed information about a specific user by their ID or reference',
        category: 'User Management'
      },
      {
        name: 'Get Self',
        description: 'Retrieves information about your own bot user and the Notion workspace you\'re connected to',
        category: 'User Management'
      },
      {
        name: 'Search',
        description: 'Find anything in your Notion workspace, connected apps (e.g. Slack, Google Drive, Github, Jira, Microsoft Teams, Sharepoint, OneDrive, or Linear), or the web by asking questions in plain English',
        category: 'Search & Discovery'
      },
      {
        name: 'Search by Title',
        description: 'Fallback search tool when AI subscription isn\'t available. Performs keyword search on page titles only',
        category: 'Search & Discovery'
      },
      {
        name: 'Create Pages',
        description: 'Make new pages in your workspace with any content you want. Specify where you would like this page to be added or it will be a default private page',
        category: 'Content Creation'
      },
      {
        name: 'Create a comment',
        description: 'Add a comment to a page or block from within the MCP client',
        category: 'Collaboration'
      }
    ]
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Work management platform for teams to organize, track, and manage their work',
    icon: '/integration-icons/asana.png',
    connectUrl: '/api/auth/asana/connect',
    externalUrl: 'https://asana.com',
    tools: [
      {
        name: 'Create Task',
        description: 'Create a new task in Asana with details, assignee, and due date',
        category: 'Task Management'
      },
      {
        name: 'List Tasks',
        description: 'Retrieve tasks from projects, teams, or assigned to specific users',
        category: 'Task Management'
      },
      {
        name: 'Get Task',
        description: 'Get detailed information about a specific task including custom fields and attachments',
        category: 'Task Management'
      },
      {
        name: 'Update Task',
        description: 'Modify task properties like name, notes, assignee, due date, or completion status',
        category: 'Task Management'
      },
      {
        name: 'Delete Task',
        description: 'Remove a task from Asana permanently',
        category: 'Task Management'
      },
      {
        name: 'Create Project',
        description: 'Create a new project with specified settings and team assignment',
        category: 'Project Management'
      },
      {
        name: 'List Projects',
        description: 'Get projects from workspaces, teams, or assigned to specific users',
        category: 'Project Management'
      },
      {
        name: 'Get Project',
        description: 'Retrieve detailed project information including custom fields and status',
        category: 'Project Management'
      },
      {
        name: 'Update Project',
        description: 'Modify project properties like name, description, status, or team assignment',
        category: 'Project Management'
      },
      {
        name: 'List Teams',
        description: 'Get all teams in the workspace that the user has access to',
        category: 'Team Management'
      },
      {
        name: 'Get Team',
        description: 'Retrieve detailed information about a specific team and its members',
        category: 'Team Management'
      },
      {
        name: 'List Users',
        description: 'Get users from the workspace or specific teams',
        category: 'User Management'
      },
      {
        name: 'Get User',
        description: 'Retrieve detailed information about a specific user',
        category: 'User Management'
      },
      {
        name: 'Search',
        description: 'Search across tasks, projects, and other content in Asana workspace',
        category: 'Search & Discovery'
      },
      {
        name: 'Create Comment',
        description: 'Add a comment to a task or project for collaboration',
        category: 'Collaboration'
      },
      {
        name: 'List Comments',
        description: 'Retrieve comments from tasks or projects',
        category: 'Collaboration'
      }
    ]
  },
  {
    id: 'atlassian',
    name: 'Atlassian',
    description: 'Jira and Confluence integration for issue tracking and documentation',
    icon: '/integration-icons/atlassian.webp',
    connectUrl: '/api/auth/atlassian/connect',
    externalUrl: 'https://atlassian.com',
    tools: [
      {
        name: 'Create Issue',
        description: 'Create a new Jira issue with details, assignee, and priority',
        category: 'Issue Management'
      },
      {
        name: 'List Issues',
        description: 'Retrieve issues from Jira projects with filtering and search',
        category: 'Issue Management'
      },
      {
        name: 'Get Issue',
        description: 'Get detailed information about a specific Jira issue',
        category: 'Issue Management'
      },
      {
        name: 'Update Issue',
        description: 'Modify issue properties like summary, description, status, or assignee',
        category: 'Issue Management'
      },
      {
        name: 'Transition Issue',
        description: 'Move issues through workflow states (e.g., To Do → In Progress → Done)',
        category: 'Issue Management'
      },
      {
        name: 'Add Comment',
        description: 'Add comments to Jira issues for collaboration and updates',
        category: 'Collaboration'
      },
      {
        name: 'Get Comments',
        description: 'Retrieve comments from Jira issues',
        category: 'Collaboration'
      },
      {
        name: 'List Projects',
        description: 'Get all Jira projects accessible to the user',
        category: 'Project Management'
      },
      {
        name: 'Get Project',
        description: 'Retrieve detailed information about a specific Jira project',
        category: 'Project Management'
      },
      {
        name: 'List Sprints',
        description: 'Get active and completed sprints for Agile projects',
        category: 'Agile Management'
      },
      {
        name: 'Get Sprint',
        description: 'Retrieve detailed information about a specific sprint',
        category: 'Agile Management'
      },
      {
        name: 'List Boards',
        description: 'Get Scrum and Kanban boards for project management',
        category: 'Agile Management'
      },
      {
        name: 'Search JQL',
        description: 'Execute JQL (Jira Query Language) searches for advanced issue filtering',
        category: 'Search & Discovery'
      },
      {
        name: 'Create Page',
        description: 'Create new pages in Confluence spaces',
        category: 'Documentation'
      },
      {
        name: 'Get Page',
        description: 'Retrieve Confluence page content and metadata',
        category: 'Documentation'
      },
      {
        name: 'Update Page',
        description: 'Edit existing Confluence pages',
        category: 'Documentation'
      },
      {
        name: 'Search Confluence',
        description: 'Search across Confluence spaces and pages',
        category: 'Documentation'
      },
      {
        name: 'List Spaces',
        description: 'Get all Confluence spaces accessible to the user',
        category: 'Documentation'
      }
    ]
  }
]
