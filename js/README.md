# Code Architecture Documentation

## Overview

This codebase follows **Clean Architecture** principles and **SOLID** design patterns to create a maintainable, testable, and scalable game application.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│         (HTML, CSS, DOM)                │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         Application Layer               │
│         (Game.js - Orchestrator)        │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│          Domain Layer                   │
│  (Entities, Managers, Utils)            │
│  • Player                               │
│  • AudioManager                         │
│  • UIManager                            │
│  • InputManager                         │
│  • CollisionDetector                    │
│  • DOMBuilder                           │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│       Configuration Layer               │
│         (GameConfig)                    │
└─────────────────────────────────────────┘
```

## Directory Structure

```
js/
├── main.js                 # Entry point
├── Game.js                 # Main orchestrator
├── config/
│   └── GameConfig.js       # Centralized configuration
├── entities/
│   └── Player.js           # Player entity with physics
├── managers/
│   ├── AudioManager.js     # Audio control
│   ├── UIManager.js        # UI and info boxes
│   └── InputManager.js     # Input handling
└── utils/
    ├── CollisionDetector.js # Collision algorithms
    └── DOMBuilder.js        # DOM creation utilities
```

## Design Principles Applied

### 1. **Single Responsibility Principle (SRP)**
Each class has one reason to change:
- `AudioManager`: Only handles audio
- `UIManager`: Only handles UI elements
- `Player`: Only handles player state and movement
- `InputManager`: Only handles user input
- `CollisionDetector`: Only handles collision logic

### 2. **Open/Closed Principle (OCP)**
Classes are open for extension but closed for modification:
- New game entities can be added without modifying existing code
- New input methods can be added by extending InputManager

### 3. **Dependency Inversion Principle (DIP)**
High-level modules don't depend on low-level modules:
- `Game` depends on abstractions (managers) not implementations
- Configuration is injected, not hardcoded

### 4. **Separation of Concerns**
Clear boundaries between:
- **Business Logic** (Game orchestration)
- **Data Management** (Managers)
- **Presentation** (DOM manipulation)
- **Configuration** (GameConfig)

### 5. **DRY (Don't Repeat Yourself)**
- Utilities are extracted into reusable modules
- Common patterns are centralized

## Key Classes

### Game (Orchestrator)
**Responsibility**: Coordinate all game components
- Manages game lifecycle
- Coordinates managers
- Handles game state
- Implements game loop

### Player (Entity)
**Responsibility**: Player behavior and physics
- Movement (left, right, jump)
- Physics simulation
- State management (walking, jumping, direction)

### AudioManager
**Responsibility**: Audio playback
- Background music control
- Victory music playback
- Volume management
- Autoplay handling

### UIManager
**Responsibility**: UI elements
- Info box creation and management
- Info display with timeout
- XSS protection (HTML escaping)

### InputManager
**Responsibility**: User input
- Keyboard controls
- Mobile touch controls
- Mouse controls
- Input delegation to Player

### CollisionDetector (Utility)
**Responsibility**: Collision algorithms
- Rectangle collision detection
- Player-box collision checking
- Proximity detection

### DOMBuilder (Utility)
**Responsibility**: DOM creation
- Creates game world elements
- Handles DOM manipulation
- Centralizes DOM creation logic

### GameConfig (Configuration)
**Responsibility**: Centralized constants
- Physics constants
- Game settings
- Audio settings
- Animation timings

## Clean Code Practices

### Naming Conventions
- **Classes**: PascalCase (e.g., `AudioManager`)
- **Methods**: camelCase with verbs (e.g., `playBackgroundMusic()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `JUMP_FORCE`)
- **Private methods**: Prefixed with underscore (future implementation)

### Method Size
- Methods are small and focused (< 20 lines ideal)
- Each method does one thing well
- Methods have clear, descriptive names

### Comments
- JSDoc comments for public methods
- Explain "why" not "what"
- Self-documenting code preferred

### Error Handling
- Try-catch blocks at boundaries
- Graceful degradation
- Console warnings for non-critical errors

## Benefits of This Architecture

### 1. **Maintainability**
- Easy to find and fix bugs
- Clear structure and responsibilities
- Self-documenting code

### 2. **Testability**
- Each class can be unit tested independently
- Mocked dependencies
- Isolated business logic

### 3. **Scalability**
- Easy to add new features
- New managers can be added without touching existing code
- Configuration-driven behavior

### 4. **Reusability**
- Managers can be reused in other projects
- Utilities are generic and reusable
- Player entity can be extended

### 5. **Readability**
- Clear separation of concerns
- Consistent naming
- Well-documented interfaces

## Future Improvements

### Potential Enhancements
1. **Dependency Injection Container**: For better testability
2. **Event System**: For decoupled communication between components
3. **State Machine**: For player states (idle, walking, jumping)
4. **Service Layer**: For API calls or data persistence
5. **TypeScript**: For type safety and better IDE support

### Testing Strategy
1. **Unit Tests**: Test each class in isolation
2. **Integration Tests**: Test manager interactions
3. **E2E Tests**: Test full game flow

## Usage Example

```javascript
// Simple usage
import { Game } from './Game.js';

const game = new Game();
game.initialize();

// Get game state
const state = game.getGameState();
console.log(state.coinsCollected);
```

## Contributing Guidelines

When adding new features:
1. Follow Single Responsibility Principle
2. Add proper JSDoc comments
3. Keep methods small and focused
4. Add to appropriate layer (Entity, Manager, Util)
5. Update GameConfig for new constants
6. Maintain backward compatibility

## Performance Considerations

- **Game Loop**: Uses `requestAnimationFrame` for optimal performance
- **Event Delegation**: Minimizes event listeners
- **DOM Manipulation**: Batched when possible
- **Collision Detection**: Optimized rectangle checking

---

**Architecture designed by**: Clean Code principles
**Patterns used**: MVC-inspired, Service Layer, Factory Pattern
**Principles**: SOLID, DRY, KISS, YAGNI
