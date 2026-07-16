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

1. **State Management:** Now, The `AppProvider` handles the main state globally—stuff like what view u are looking at (`currentView`), when to pop up notifications, and companion custom presets.
2. **Context Routing:** So, Instead of installing a massive router that slows things down, `App.tsx` reads the context state natively and dynamically swaps out pages like the `LandingPage`, login screens, and the core `Dashboard` instantly.
3. **Responsive Box Layout:** Basically, The main container forces a strict aspect ratio (`maxWidth: '177.78vh'`, `maxHeight: '100vh'`) so the dashboard elements never stretch or break on widescreen monitors.
4. **Frontend:** So this is Built using React/TypeScript for structured, type-safe, and component-based UI rendering.
5. **Styling:** It's Styled with Tailwind CSS to ensure a clean, modern, and highly responsive user interface.
6. **Deployment:** As recommended by the shipping guide itself, this is Hosted on Vercel for continuous integration and super fast loading speeds.
7. **Version Control** Done by Git and Github.

# Future Roadmap (What's Coming Next)
To hit the build goals for the project pipeline, I already structurally wired the placeholder files right into the context paths. The baseline UI is fully rendering across the master branch and ready for feature logic to be injected:-

**Smart Planner:** Full CRUD operations to add/delete assignments.
**Pixel Companion:** A little canvas-based pixel pet that tracks your study streaks.
**Mood Tracker:** Simple local storage logging to track mental fatigue.
**Weekly Timetable:** An interactive calendar block for class schedules.

## Local Setup

### Prerequisites
You just need Node.js (v18 or higher) and npm installed.

### Run It Locally
1. Clone the repo:
   ```bash
   git clone [https://github.com/ahmadinnovator3-dev/Horizons-arcana-project.git](https://github.com/ahmadinnovator3-dev/Horizons-arcana-project.git)


2. Install Dependencies:

npm install

3. Run the Development Server

npm run dev

4. Once started, open http://localhost:5173


## Screenshots:

So, this is what the main landing page looks like: 

<img width="1858" height="916" alt="image" src="https://github.com/user-attachments/assets/10de662b-432b-4e3b-8a2c-6e3674242ca4" />

And this is the Dashboard: 

<img width="1851" height="917" alt="image" src="https://github.com/user-attachments/assets/d058cef8-d95d-4649-9c39-7d7af904bbaa" />

<img width="1841" height="916" alt="image" src="https://github.com/user-attachments/assets/53bcc7d9-3e4f-4ce1-89bb-197f2d48bc3b" />

This is the drawer with all features and access buttons:

<img width="307" height="883" alt="image" src="https://github.com/user-attachments/assets/ec425f23-80f4-48cf-b6b5-be373292a3ce" />

This is the Focus Time Feature:

<img width="1853" height="913" alt="image" src="https://github.com/user-attachments/assets/36102731-8e2c-4d26-85b1-6141faa6156d" />

This is the AI Study helper feature:

<img width="1842" height="913" alt="image" src="https://github.com/user-attachments/assets/4b220217-9a55-447c-ad7f-0285f9a9e46b" />

This is the Tea Lounge Chat Zone:

<img width="1722" height="881" alt="image" src="https://github.com/user-attachments/assets/536cffbc-c62e-4e33-a0b7-b38106fc0b8d" />



## AI Disclosure
Yeah ngl, I used AI a bit while building this, but mostly just as a pair programmer to help me unblock annoying TypeScript bugs, fix build configs, and layout the basic structure. The actual concept, routing, UX decisions, and core logic are 100% mine. I Kept the AI usage wayyyy under the 30% limit. it was basically just a smarter Stack Overflow for when things broke.

### PS: 
Since the onboarding page is still under construction, you can view the dashboard by entering with the Reviewer Bypass Button, It is a Big red, rectangular button on the landing page right next to the "Get Started Free" Button.
