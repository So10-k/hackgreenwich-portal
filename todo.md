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
- [x] Create final checkpoint

## UI/UX Enhancements
- [x] Create proper dashboard layout with sidebar navigation
- [x] Add persistent navbar with logo, links, and logout button
- [x] Redesign dashboard to look more like a professional dashboard
- [x] Add project submission card with admin approval workflow
- [x] Expand admin dashboard with participant management
- [x] Add announcement management interface for admins
- [x] Add team management interface for admins
- [x] Create submission review interface for admins

## Profile Page Enhancement
- [x] Create comprehensive profile editing form
- [x] Add skills selection with predefined options and custom input
- [x] Add interests selection with predefined options and custom input
- [x] Add bio text area with character limit
- [x] Add experience level selector
- [x] Add social links (GitHub, LinkedIn, Portfolio)
- [x] Add "looking for team" toggle
- [x] Display profile preview card
- [x] Save profile changes to Supabase

## Supabase Migration
- [x] Migrate database schema to Supabase PostgreSQL
- [x] Set up Supabase authentication (email/password, social login)
- [x] Update backend to use Supabase client
- [x] Update frontend auth flow to use Supabase
- [x] Migrate all data from MySQL to Supabase
- [x] Remove all Manus OAuth dependencies
- [x] Test full authentication flow
- [x] Verify database operations with Supabase

## Deployment Fixes
- [x] Fix build script to compile server entry point correctly
- [x] Ensure dist/index.js is created during build
- [x] Disable email verification for Supabase signups
- [x] Test production build locally

## Homepage Redesign & Bug Fixes
- [x] Fix registration redirect loop between dashboard and register page
- [x] Fix routing so authenticated users don't get stuck in redirect loop
- [x] Create parallax scrolling background effect
- [x] Add animated text that flies into screen on scroll
- [x] Implement smooth scroll animations with framer-motion
- [x] Test all authentication flows and redirects

## Vercel Deployment Fix
- [x] Create vercel.json configuration file
- [x] Configure proper Node.js runtime for Vercel
- [x] Update build output directory structure
- [x] Test deployment configuration

## Vercel 404 Error Fix
- [x] Remove old vercel.json builds configuration
- [x] Update to use modern Vercel Build Output API
- [x] Test deployment configuration

## Railway Deployment
- [x] Create railway.json configuration file
- [x] Create Nixpacks configuration for build
- [x] Remove Vercel-specific files
- [x] Create Railway deployment guide

## Railway Deployment Fix
- [x] Fix nixpacks.toml Node.js package name

## Production tRPC URL Fix
- [x] Fix tRPC client to use correct production URL
- [x] Handle both development and production environments

## Schedule Page
- [x] Create schedule_events table in database
- [x] Add backend API for schedule CRUD operations
- [x] Create Schedule page with timeline view
- [x] Add day/date filtering
- [x] Show event times in user's timezone
- [x] Admin interface for managing schedule events

## Sponsor Showcase
- [x] Create sponsors table in database
- [x] Add backend API for sponsor CRUD operations
- [x] Create Sponsors page with company cards
- [x] Display sponsor logos, descriptions, and links
- [x] Add sponsor tiers (Gold, Silver, Bronze)
- [x] Admin interface for managing sponsors

## Remove Manus Analytics
- [x] Remove VITE_ANALYTICS_ENDPOINT references
- [x] Remove analytics script from index.html
- [x] Fix Invalid URL errors on dashboard

## CRITICAL: Fix Production Invalid URL Error
- [x] Audit all environment variable usage in client code
- [x] Check for undefined or placeholder environment variables
- [x] Fix all URL construction that might use invalid values
- [x] Test production build locally

## Fix Teams Page Error
- [x] Fix Teams page to handle undefined member data
- [x] Add null checks for team member properties
- [x] Test Teams page with empty and populated data

## Fix Dashboard Error
- [x] Find and fix Dashboard error reading 'name' property
- [x] Add null checks for all user/team data on Dashboard

## CSV Export Feature
- [x] Add CSV export button to Admin Panel Teams tab
- [x] Generate CSV with team roster including member details
- [x] Implement download functionality

## Fix React Key Warning
- [x] Find missing key props in Dashboard component
- [x] Add unique keys to all list items

## Fix Teams Component Issues - CRITICAL
- [x] Find ACTUAL missing React key in Teams component (Button elements in invitations)
- [x] Migrate all team queries from MySQL/Drizzle to Supabase
- [x] Update routers.ts to use Supabase functions (db-supabase.ts)
- [x] Fix getMyTeam to use getTeamWithMembers
- [x] Fix team invitations to use Supabase functions
- [x] Fix teammates, resources, and announcements routers

## Complete Supabase Migration Tasks
- [x] Add Teams page maintenance message
- [x] Implement declineTeamInvitation in db-supabase.ts
- [x] Implement declineConnectionRequest in db-supabase.ts
- [x] Implement deleteResource in db-supabase.ts
- [x] Implement updateAnnouncement in db-supabase.ts
- [x] Implement deleteAnnouncement in db-supabase.ts
- [x] Add loading skeletons to Dashboard page
- [x] Add loading skeletons to Teams page
- [x] Add loading skeletons to Teammates page
- [x] Migrate test suite to use Supabase instead of MySQL
- [x] Create comprehensive Supabase database tests

## Add Sponsors and Schedule Configuration
- [x] Create Supabase SQL schema for sponsors and schedule tables
- [x] Add Supabase functions for sponsors CRUD operations
- [x] Add Supabase functions for schedule CRUD operations
- [x] Add tRPC procedures for sponsors management
- [x] Add tRPC procedures for schedule management
- [x] Add Sponsors tab to Admin Panel with CRUD UI
- [x] Add Schedule tab to Admin Panel with CRUD UI

## Fix Registration Flow Issues
- [x] Debug why Devpost verification doesn't persist when returning to register page
- [x] Add completeRegistration and confirmDevpostRegistration procedures
- [x] Add getRegistrationStatus to persist step across page refreshes
- [x] Fix Registration component to use correct Supabase procedures
- [x] Fix users not appearing in pending portal access after Devpost verification
- [x] Change AdminPanel to use Supabase tRPC client
- [x] Add getAllTeamsWithMembers to Supabase teams router
- [x] Fix sponsors.listAll to sponsors.list
- [x] Test complete registration flow from sign-up to admin approval

## Create Public Schedule and Sponsors Pages
- [x] Create /schedule page with event timeline display
- [x] Create /sponsors page with tier-based sponsor showcase
- [x] Add navigation links to both pages (Home nav bar)
- [x] Style pages with responsive design (gradient backgrounds, cards)

## Update Homepage for Logged-In Users
- [x] Show "Dashboard" button instead of "Sign In" and "Get Started" for authenticated users
- [x] Keep existing buttons for non-authenticated visitors

## Branding Update
- [x] Change all instances of "Hack Greenwich" to "HackGreenwich" (already correct)
- [x] Update page titles and meta tags
- [x] Update navigation and footer text

## Auto-Approval Registration
- [x] Modify registration flow to automatically grant portal access after signup
- [x] Remove Devpost verification step requirement
- [x] Remove admin approval requirement for initial access

## Logo and Branding Update
- [x] Upload HackGreenwich logo to public folder
- [x] Update all logo references to use the new logo image
- [x] Change "RoleColorOne" to "ONERCF" throughout the site

## Color Scheme Redesign
- [x] Update CSS variables to use logo colors (Red #ED1C24, Yellow #FFD100, Green #00A651)
- [x] Update homepage gradient backgrounds to match new color scheme
- [x] Update button colors and UI components
- [x] Update navigation and footer styling

## Homepage Design Refinement
- [x] Upload OneRCF logo and replace text with logo image
- [x] Increase HackGreenwich logo size in navigation
- [x] Soften background gradients to be less intense
- [x] Reduce color saturation for a more professional look
- [x] Update text colors to be more subtle and readable

## Sponsors and Schedule Page Updates
- [x] Add navigation header to Sponsors page matching homepage theme
- [x] Add navigation header to Schedule page matching homepage theme
- [x] Update Sponsors page styling to match dark theme
- [x] Update Schedule page styling to match dark theme
- [x] Create email template for "Become a Sponsor" button
- [x] Set up mailto link to hackgreenwich@rolecolorfinder.com

## Logo Size Adjustments
- [x] Increase HackGreenwich logo size in navigation (h-16)
- [x] Increase OneRCF logo size (h-12)
- [x] Move OneRCF logo to separate line under "Sponsored by"

## Logo Size Increase
- [x] Increase HackGreenwich logo to h-20 across all pages
- [x] Increase OneRCF logo to h-16

## Theme Application
- [x] Apply dark slate theme to all remaining pages
- [x] Update Dashboard and internal pages with consistent branding
- [x] Add navigation headers to all pages

## Team Features Removal
- [x] Comment out team-related navigation items
- [x] Comment out team pages and features
- [x] Remove team references from AdminPanel

## Participant Browser
- [x] Create Participants page with user listing
- [x] Display user status (admin/user badge)
- [x] Show skills for each participant
- [x] Display GitHub repository links if available
- [x] Add search and filter functionality
- [x] Create backend endpoint for participant listing

## Participant Page Fix
- [x] Check Supabase users table schema
- [x] Update getAllParticipants query to match correct schema
- [x] Remove has_portal_access filter (using portal_access_granted)
- [x] Remove non-existent fields (school, major, graduation_year)
- [x] Test participant page loads all users correctly

## Participant Card Privacy & URL Validation
- [x] Remove email display from participant cards for privacy
- [x] Validate GitHub URLs are properly formatted with regex extraction
- [x] Add LinkedIn and portfolio URL display if available
- [x] Ensure all social media links have proper protocols and open to correct sites

## Mobile Responsiveness & URL Security
- [x] Create URL confirmation dialog component
- [x] Add confirmation dialog to all external links (GitHub, LinkedIn, Portfolio, Sponsor links)
- [x] Improve homepage mobile layout (hero, features, stats sections)
- [x] Improve Schedule and Sponsors page mobile layout
- [x] Improve participant cards mobile layout (stack buttons vertically on mobile)
- [x] Test navigation and interactions on mobile viewport

## Mobile Hamburger Menu
- [x] Create MobileMenu component with hamburger icon
- [x] Add slide-out drawer with navigation links
- [x] Integrate into Homepage navigation
- [x] Integrate into Sponsors and Schedule pages
- [x] Hide desktop navigation on mobile, show hamburger instead

## Portal Mobile Menu
- [x] Add hamburger menu to PortalLayout component
- [x] Make sidebar collapsible on mobile with hamburger toggle
- [x] Test on Dashboard, Participants, and other portal pages

## Event Date Update
- [x] Change event dates from March 15-17 to March 1-3
- [x] Update homepage hero section
- [x] Update all references across pages

## Judges Portal
- [x] Add 'judge' role to user role enum in schema
- [x] Create judge_announcements table in Supabase
- [x] Create judges portal dashboard page
- [x] Show all participants with emails (judges can see emails)
- [x] Display judge-specific announcements
- [x] Add Devpost link section
- [x] Create backend endpoints for judge data
- [x] Add judge navigation in PortalLayout
- [x] Generate Supabase SQL queries for setup

## Admin Judge Announcements Interface
- [x] Add judge announcements tab to Admin Panel
- [x] Create form to post new judge announcements
- [x] Display list of existing judge announcements
- [x] Add backend endpoints for CRUD operations

## Winners Announcement Page
- [x] Create winners database table in Supabase (winners-setup.sql)
- [x] Build public winners page at /winners route
- [x] Display winning teams with photos and descriptions
- [x] Show prize categories (1st, 2nd, 3rd, special awards)
- [x] Add project links and team member information
- [x] Create admin interface placeholder for winners
- [x] Add winners to navigation menu

## Judges Dashboard Styling
- [x] Add PortalLayout with sidebar navigation to Judges Dashboard
- [x] Apply dark theme to match main site design
- [x] Update card styling and colors for consistency

## Winners Page Contrast Fix
- [x] Fix text colors to be readable against dark background
- [x] Update button text colors for better visibility
- [x] Ensure all card text has proper contrast
