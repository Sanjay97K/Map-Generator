# Game Map Generation

This project allows the generation of a game map with configurable parameters. Players can move around the map, and when they step on grass tiles, there is a 20% chance of encountering a Pokémon.

## Features

- **Map Generation**: The map is generated based on configurable parameters.
  - **Water**: Percentage of tiles dedicated to water.
  - **Grass**: Percentage of tiles dedicated to grass.
  - **Land**: Percentage of tiles dedicated to land.
  
- **Character Movement**: The player can move the character using the arrow keys.
  - Movement is restricted to non-water tiles (water tiles are impassable).

- **Pokemon Encounter**: Each time the player moves onto a grass tile, there is a 20% chance of encountering a Pokémon, which is automatically added to the player's list.

- **Save & Load Game**: The game state (including map, cursor position, and captured Pokémon) can be saved to and loaded from the browser's local storage.

## Setup

1. Clone the repository.
2. Run `npm install` to install the necessary dependencies.
3. Run `npm run dev` to start the development server.

## Controls

- Use the arrow keys to move the character.
- The character can move on land and grass tiles, but not on water tiles.
- When stepping on grass tiles, you may encounter a Pokémon with a 20% chance.
- You can save and load your game using the provided buttons.

## Customization

- You can adjust the map's size and the distribution of water, grass, and land tiles through the input fields in the UI.
- The percentages for water, grass, and land tiles can be customized to control the map generation.

## License

MIT License
