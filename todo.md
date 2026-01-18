# HackGreenwich Portal TODO

## Database Schema
- [x] Design users table with registration status, skills, interests, experience level
- [x] Create teams table with team information and member management
- [x] Design team_members junction table for team membership
- [x] Create connection_requests table for teammate connections
- [x] Design resources table with categories and file storage
- [x] Create announcements table with admin posting capabilities
- [x] Set up Supabase sync configuration

## Authentication & Registration
- [x] Multi-step registration flow (Step 1: Portal registration)
- [x] Supabase database synchronization for user data
- [x] Step 2: Devpost registration verification system
- [x] Step 3: Portal access control after verification
- [x] User profile completion system

## User Profile System
- [x] Profile page with editable fields (skills, interests, experience)
- [x] Project preferences and bio
- [ ] Profile visibility settings
- [ ] Avatar/photo upload functionality

## Teammate Finder
- [x] Browse all participants interface
- [x] Filter by skills, interests, and experience level
- [x] Search functionality for finding teammates
- [x] Send connection requests to other users
- [x] Accept/decline connection requests
- [x] View connections list

## Team Management
- [x] Create team functionality
- [x] Team profile page with description and goals
- [x] Invite members to team
- [x] Accept/decline team invitations
- [x] View team roster and member details
- [ ] Leave team functionality
- [x] Team size limits and validation

## Resource Library
- [x] Resource listing page with categories
- [x] Filter resources by category (APIs, tutorials, tools, datasets)
- [x] Resource detail view with download/access links
- [x] Admin: Upload new resources
- [x] Admin: Categorize and manage resources
- [ ] Resource search functionality

## Announcements
- [x] Announcements dashboard for participants
- [x] Chronological display with timestamps
- [x] Admin: Create new announcements
- [x] Admin: Edit/delete announcements
- [x] Announcement categories/tags
- [x] Mark announcements as important/pinned

## Admin Panel
- [x] Admin dashboard overview
- [x] View all registrations
- [x] Approve portal access after Devpost verification
- [x] Manage user accounts and roles
- [x] Post and manage announcements
- [x] Upload and manage resources
- [ ] View analytics (registrations, teams, connections)

## Visual Design
- [x] Elegant color palette and typography
- [x] Consistent component styling with shadcn/ui
- [x] Responsive layout for all screen sizes
- [x] Smooth transitions and animations
- [x] Professional landing page
- [x] Dashboard layout for authenticated users
- [x] Loading states and empty states
- [x] Error handling UI

## Testing & Deployment
- [x] Write vitest tests for critical flows
- [x] Test registration and verification flow
- [x] Test team creation and invitations
- [x] Test connection requests
- [x] Test admin functionalities
- [ ] Create final checkpoint
