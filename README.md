<center>
## 🧠 **Tredence AI Studio: HR Workflow Designer Module**
</center>
A highly scalable, performant module designed for HR administrators to visually create, validate, and simulate complex internal workflows. Built with a focus on clean architecture, type safety, and product ergonomics.



## 🏗️ **The Technical Architecture**
I adopted a Feature-Sliced Design (FSD) approach to ensure the codebase scales as the platform evolves from a single module to a multi-agent ecosystem.

- **The Data Core (/store):** Centralized state management using Zustand, optimized for high-frequency updates and low-latency UI synchronization.

- **The Visual Engine (/features/canvas):** A highly customized React Flow implementation featuring five distinct neural node types (Start, Task, Approval, Automated, End).

- **The Dynamic Configurator (/features/forms):** A context-aware panel powered by React Hook Form, capable of handling complex metadata and dynamic input validation.

- **The Simulation Layer (/api):** An abstracted mock service layer that serializes the entire graph and performs DFS-based validation for connectivity and cycles.


## 🛠️ **Technical Stack**
- Framework: React 18 (Vite) + TypeScript (Strict Mode)
- Styling: Tailwind CSS v4
- State Management: Zustand (with Zundo middleware for temporal state/history tracking)
- Workflow Engine: React Flow
- Form Handling & Validation: React Hook Form + Zod
- UI Components: Sonner (Toast notifications), Lucide React (Icons)

## 🚀 **How to run**
Execute these commands to get started:
- Install Dependencies:
    - npm install

- Launch Dev Environment:
    - npm run dev

Access the designer module at: http://localhost:5173

## ⚖️ **Architecture & Design Decisions**
- **Zustand Over Redux:** Selected for its minimal boilerplate and highly optimized performance when handling complex, frequently updating object graphs (like workflow nodes and edges).
- **Temporal State Management:** Implemented Undo/Redo functionality (supported by keyboard shortcuts Ctrl+Z/Y) to provide a fault-tolerant user experience during complex graph arrangements.
- **Vector-Based Assets:** Utilized SVG assets exclusively (including the custom-coded favicon) to maintain rendering fidelity across various screen resolutions and zoom levels.
- **TailwindCSS for Styling:** Styled the application using modern TailwindCSS making it rsponsive & modern.
- **Notifications:** Implemented Toast Notifications using Sonner library for propoer feedback to user & improved User Experience (UX)



## 🚧**Technical Challenges & Solutions**
### 1. **Managing Stale Closures in Custom Nodes**
**Challenge:** React Flow custom nodes can inadvertently trap stale state within closures, failing to reflect the latest global store updates during rapid edits.
**Solution:** Decoupled the local component state from the React Flow data object. I utilized useEffect hooks to synchronize the local form state with the global store selectively, ensuring data integrity without triggering expensive, canvas-wide re-renders.

### 2. **Ensuring Strict Type Compliance (verbatimModuleSyntax)**
**Challenge:** The modern Vite/TypeScript configuration enforces strict module syntax, which complicates standard imports for types like Node and Edge.
**Solution:** Refactored the codebase to explicitly separate type-only imports using import type and updated the Zustand store interfaces. This satisfied the compiler’s most rigorous linting rules and resulted in a zero-warning production build.

### 3. **Data Persistence and Schema Integrity during Hydration**
* **Challenge:** Implementing the "Import JSON" feature introduced a risk of application crashes if a user uploaded a malformed or outdated JSON schema. Directly hydrating the **Zustand store** with untrusted external data could lead to inconsistent UI states or runtime errors.
* **Solution:** I implemented a **Schema Validation Layer** using **Zod**. Before the imported JSON is allowed to hydrate the store, it is parsed against a strict **TypeScript-defined schema**. If the validation fails, the application rejects the import and provides a specific **error toast**, ensuring the internal state remains "sane" and the graph remains renderable.

### 4. **Preventing Keyboard Shortcut Collisions**
* **Challenge:** After implementing global keyboard shortcuts for **Undo/Redo (Ctrl+Z, Ctrl+Y)**, I found that the shortcuts would trigger even when the user was actively typing a "Z" or "Y" inside a text input or description field in the sidebar. This led to accidental undos while the user was simply trying to fill out a form.
* **Solution:** I refined the event listener logic to check the **`event.target`**. By implementing a **guard clause** that detects if the active element is an `INPUT` or `TEXTAREA`, I successfully isolated the shortcuts to only trigger when the user is interacting with the canvas, protecting the data integrity of the configuration forms.

### 6. **Enforcing Semantic Connection Constraints**
* **Challenge:** By default, React Flow allows any node to connect to any other node. However, in a professional HR workflow, certain connections are logically impossible (e.g., an **"End Node"** cannot have an outgoing connection, and a **"Start Node"** cannot be a target).
* **Solution:** I implemented a custom **`isValidConnection`** check within the React Flow component. This logic validates the **source and target** types in real-time. For instance, it prevents connections originating from an End Node or terminating at a Start Node. This **"fail-fast" UI approach** prevents users from building logically broken workflows before they even reach the simulation stage.

## 📈 Implementation Status & Roadmap

### **Completed Features**

* **Interactive Canvas:** Full **drag-and-drop orchestration** supporting 5 custom node types (**Start, Task, Approval, Automated, and End nodes**).
* **Dynamic Configuration Engine:** A context-aware side panel built with **`react-hook-form`** and **`useFieldArray`** to handle complex key-value metadata and dynamic custom fields.
* **Temporal State:** Full **history tracking** allowing users to **Undo/Redo** modifications to the workflow graph seamlessly.
* **Data Persistence:** A robust **Export/Import system** that serializes the entire graph to **JSON** for local storage and portability.
* **User Interface:** **System-aware Dark Mode**, filterable **global search** for node scalability, and real-time **toast notifications** for critical actions.
* **Sandbox Simulator:** A mock execution environment that validates **structural constraints** (e.g., mandatory start nodes, **cycle detection**, and connection validation) before generating a step-by-step execution timeline.

---

### **Future Roadmap** *(What I would add with more time)*

* **Real-Time Node Rendering:** Updating node visuals **dynamically on the canvas** as the user types in the configuration panel, eliminating the need for an explicit "Save" action.
* **Backend Integration:** Replacing the mock API layer with a **Python/FastAPI microservice** to handle actual execution triggers for automated steps (e.g., **"Send Email"** or **"Generate PDF"**).
* **Node Versioning:** Introducing a **snapshot system** allowing users to capture, save, and **compare different iterations** of the same workflow side-by-side.
* **Collaborative Editing:** Integrating **WebSockets** (via Ably or Pusher) to support concurrent, **multi-user workflow design** with live presence indicators.

🎯 **Closing Thought**
              "The best way to predict the future is to architect it, one node at a time."

<center>
**Developed with passion by D. Sai Harsha**
</center>

