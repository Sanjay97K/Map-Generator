import React, { Component } from 'react';

// Tile types with their colors and names
const tileTypes: { [key: number]: { name: string; color: string } } = {
  0: { name: 'Water', color: 'lightBlue' },
  1: { name: 'Grass', color: 'green' },
  2: { name: 'Land', color: 'wheat' }
};

// Interface for storing the game state
interface GameState {
  rows: number;
  columns: number;
  cursorPosition: number;
  mapData: number[];
  pokemonList: string[];
}

// Tile component state interface
interface TilesState {
  gameState: GameState;
  waterPercentage: number;
  grassPercentage: number;
  landPercentage: number;
}

class Tiles extends Component<{}, TilesState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      gameState: {
        rows: 10,
        columns: 10,
        cursorPosition: 0,
        mapData: [],
        pokemonList: []
      },
      waterPercentage: 20,
      grassPercentage: 20,
      landPercentage: 60
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.generateMap = this.generateMap.bind(this);
    this.fillZone = this.fillZone.bind(this);
    this.handlePokemonEncounter = this.handlePokemonEncounter.bind(this);
    this.saveGame = this.saveGame.bind(this);
    this.loadGame = this.loadGame.bind(this);
  }

  componentDidMount() {
    this.generateMap();
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  // Handle input changes from the user
  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const parsedValue = parseInt(value);

    if (name === 'rows' || name === 'columns') {
      this.setState({ gameState: { ...this.state.gameState, [name]: parsedValue } }, this.generateMap);
    } else if (name === 'waterPercentage' || name === 'grassPercentage' || name === 'landPercentage') {
      this.setState({ [name]: parsedValue } as any, this.generateMap);
    }
  }

  // Generate the map based on user-defined parameters
  generateMap() {
    const { rows, columns } = this.state.gameState;
    const { waterPercentage, grassPercentage } = this.state;
    const mapData = new Array(rows * columns).fill(2); // Start with all land (2)
    const totalTiles = rows * columns;
    const waterTiles = Math.floor((waterPercentage / 100) * totalTiles);
    const grassTiles = Math.floor((grassPercentage / 100) * totalTiles);
   

    // Fill water zone
    this.fillZone(mapData, 0, waterTiles);

    // Fill grass zone
    this.fillZone(mapData, 1, grassTiles);

    // Land tiles are already the default value (2), no need to change them

    this.setState({
      gameState: {
        ...this.state.gameState,
        mapData,
        cursorPosition: Math.floor(mapData.length / 2)
      }
    });
  }

  // Flood-fill to create a contiguous zone for either water or grass
  fillZone(mapData: number[], zoneType: number, totalTiles: number) {
    const { rows, columns } = this.state.gameState;
    const startTile = Math.floor(Math.random() * (rows * columns));

    const visited = new Set<number>();
    const toVisit = [startTile];
    let filled = 0;

    while (toVisit.length > 0 && filled < totalTiles) {
      const currentTile = toVisit.pop()!;
      if (visited.has(currentTile)) continue;

      visited.add(currentTile);
      mapData[currentTile] = zoneType;
      filled++;

      // Get neighboring tiles (up, down, left, right)
      const neighbors = [
        currentTile - columns, // Up
        currentTile + columns, // Down
        currentTile - 1, // Left
        currentTile + 1 // Right
      ];

      // Add valid neighbors to the toVisit stack
      neighbors.forEach((neighbor) => {
        if (neighbor >= 0 && neighbor < rows * columns && !visited.has(neighbor)) {
          toVisit.push(neighbor);
        }
      });
    }
  }

  // Handle key presses for movement
  handleKeyDown(event: KeyboardEvent) {
    const { cursorPosition, mapData, rows, columns } = this.state.gameState;
    let newCursorPosition = cursorPosition;

    switch (event.key) {
      case 'ArrowUp':
        if (cursorPosition - columns >= 0 && mapData[cursorPosition - columns] !== 0) {
          newCursorPosition = cursorPosition - columns; // Move up
        }
        break;
      case 'ArrowDown':
        if (cursorPosition + columns < mapData.length && mapData[cursorPosition + columns] !== 0) {
          newCursorPosition = cursorPosition + columns; // Move down
        }
        break;
      case 'ArrowLeft':
        if (cursorPosition % columns > 0 && mapData[cursorPosition - 1] !== 0) {
          newCursorPosition = cursorPosition - 1; // Move left
        }
        break;
      case 'ArrowRight':
        if (cursorPosition % columns < columns - 1 && mapData[cursorPosition + 1] !== 0) {
          newCursorPosition = cursorPosition + 1; // Move right
        }
        break;
      default:
        return; // Do nothing if it's not an arrow key
    }

    this.setState(
      {
        gameState: {
          ...this.state.gameState,
          cursorPosition: newCursorPosition
        }
      },
      () => this.handlePokemonEncounter()
    );
  }

  // Handle Pokémon encounter when moving on grass tiles
  handlePokemonEncounter() {
    const { cursorPosition, mapData } = this.state.gameState;
  
    if (mapData[cursorPosition] === 1 && Math.random() < 0.2) {
      const newPokemonList = [...this.state.gameState.pokemonList, `Pokemon ${this.state.gameState.pokemonList.length + 1}`];
      this.setState(
        {
          gameState: {
            ...this.state.gameState,
            pokemonList: newPokemonList
          }
        },
        () => {
          // Save the updated pokemon list to localStorage
          localStorage.setItem('pokemonList', JSON.stringify(newPokemonList));
  
          // Alert the user that a Pokémon has been caught
          alert('A wild Pokémon has been caught!');
        }
      );
    }
  }
  

  // Save the game state to local storage
  saveGame() {
    const gameState = JSON.stringify(this.state.gameState);
    localStorage.setItem('gameState', gameState);
  }

  // Load the game state from local storage
  loadGame() {
    const savedGameState = localStorage.getItem('gameState');
    if (savedGameState) {
      this.setState({
        gameState: JSON.parse(savedGameState)
      });
    }
  }

  render() {
    const { gameState, waterPercentage, grassPercentage, landPercentage } = this.state;
    const { mapData, cursorPosition, rows, columns, pokemonList } = gameState;
    const rowsArray: React.ReactElement[] = [];

    // Split mapData into rows
    for (let i = 0; i < mapData.length; i += columns) {
      const row = mapData.slice(i, i + columns);
      const rowCells = row.map((el, idx) => {
        const index = i + idx;
        const bg =
          cursorPosition === index ? 'red' : tileTypes[el].color; // Highlight the current cell
        return React.createElement(
          'td',
          {
            key: index,
            style: {
              background: bg,
              width: '40px',
              height: '40px',
              textAlign: 'center',
              border: '1px solid black'
            }
          }
        );
      });

      rowsArray.push(React.createElement('tr', { key: i }, ...rowCells));
    }

    return (
      <div>
        {/* Inputs for selecting map size and percentages */}
        <div>
          <label>
            Rows:
            <input
              type="number"
              name="rows"
              value={rows}
              onChange={this.handleInputChange}
              min="3"
            />
          </label>
          <label>
            Columns:
            <input
              type="number"
              name="columns"
              value={columns}
              onChange={this.handleInputChange}
              min="3"
            />
          </label>
          <label>
            Water Percentage:
            <input
              type="number"
              name="waterPercentage"
              value={waterPercentage}
              onChange={this.handleInputChange}
              min="10"
              max="30"
            />
          </label>
          <label>
            Grass Percentage:
            <input
              type="number"
              name="grassPercentage"
              value={grassPercentage}
              onChange={this.handleInputChange}
              min="10"
              max="30"
            />
          </label>
          <label>
            Land Percentage:
            <input
              type="number"
              name="landPercentage"
              value={landPercentage}
              onChange={this.handleInputChange}
              min="10"
              max="30"
            />
          </label>
        </div>

        {/* Render the map */}
        <table style={{ borderCollapse: 'collapse' }}>
          <tbody>{rowsArray}</tbody>
        </table>

        {/* Buttons to save and load game */}
        <button onClick={this.saveGame}>Save Game</button>
        <button onClick={this.loadGame}>Load Game</button>

        {/* Display the list of captured Pokémon */}
        <div>
          <h3>Captured Pokémon</h3>
          <ul>
            {pokemonList.map((pokemon, index) => (
              <li key={index}>{pokemon}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Tiles;
