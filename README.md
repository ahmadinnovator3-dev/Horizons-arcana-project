# Horizons-arcana-project
Right, so this is my horizons-arcana project, it is called StudentOS and it is an educational companion that helps, guides and teaches teens in their teenage life journey

# StudentOS 

Yeah, so StudentOS is basically a workspace app built for students who are tired of having fifty tabs open just to track their classes, habits, and daily focus sessions. 

I Built this entirely from scratch during the Horizons window to fix the absolute mess of juggling separate timers, planners, and schedules.

# Why I Built This
Tbh, managing school deadlines, daily tasks, timers, and mental health usually means breaking your browser with scattered extensions. StudentOS puts all of that into one screen. It uses a fixed 16:9 desktop layout so everything looks like a clean workspace dashboard rather than a teens messy webpage.

# Tech Stack
* React 18 + TypeScript (Frontend)
* Vite (Build tool and fast dev server)
* Tailwind CSS (Styling and theme injection)
* Lucide React (Icons)
* Vercel (For hosting the live site)

# How It Actually Works Under the Hood
The project is built as a single-page application (SPA) powered by a global React Context provider (`AppContext.tsx`). 

1. **State Management:** The `AppProvider` handles the main state globally—stuff like what view u are looking at (`currentView`), when to pop up notifications, and companion custom presets.
2. **Context Routing:** Instead of installing a massive router that slows things down, `App.tsx` reads the context state natively and dynamically swaps out pages like the `LandingPage`, login screens, and the core `Dashboard` instantly.
3. **Responsive Box Layout:** The main container forces a strict aspect ratio (`maxWidth: '177.78vh'`, `maxHeight: '100vh'`) so the dashboard elements never stretch or break on widescreen monitors.

# Future Roadmap (What's Coming Next)
To hit the build goals for the project pipeline, I already structurally wired the placeholder files right into the context paths. The baseline UI is fully rendering across the master branch and ready for feature logic to be injected:
* [ ] **Smart Planner:** Full CRUD operations to add/delete assignments.
* [ ] **Pixel Companion:** A little canvas-based pixel pet that tracks your study streaks.
* [ ] **Mood Tracker:** Simple local storage logging to track mental fatigue.
* [ ] **Weekly Timetable:** An interactive calendar block for class schedules.

## Local Setup

### Prerequisites
You just need Node.js (v18 or higher) and npm installed.

### Run It Locally
1. Clone the repo:
   ```bash
   git clone [https://github.com/ahmadinnovator3-dev/Horizons-arcana-project.git](https://github.com/ahmadinnovator3-dev/Horizons-arcana-project.git)

Drop into the folder:

Bash
cd Horizons-arcana-project
Install the dependencies:

Bash
npm install
Run the local server:

Bash
npm run dev
Open up http://localhost:5173 in your browser.

## AI Disclosure
Yeah ngl I used AI a bit while building this, but mostly just as a pair-programmer to help me unblock annoying TypeScript bugs, fix build configs, and layout the basic structure. The actual concept, routing, UX decisions, and core logic are 100% mine. Kept the AI usage way under the 30% limit. it was basically just a smarter Stack Overflow for when things broke.

### PS: 
Since the sign up page is still under construction, you can view the dashboard by entering this email and password:

Email: name@school.com
Password: 123456789

If that doesnt works, first sign up with any email and password, then reload the page and enter those same credentials into the sign in page.
