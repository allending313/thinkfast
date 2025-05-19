export class RandSet {
  private set: Set<number>;
  private list: number[];

  constructor() {
    this.set = new Set();
    this.list = [];
  }

  // Add an index if it doesn't already exist
  add(index: number): void {
    if (!this.set.has(index)) {
      this.set.add(index);
      this.list.push(index);
    }
  }

  // Clear the set and list
  clear(): void {
    this.set.clear();
    this.list = [];
  }

  // Get a random value from the set
  getRandom(): number | undefined {
    if (this.list.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * this.list.length);
    return this.list[randomIndex];
  }

  // Get the number of elements
  size(): number {
    return this.list.length;
  }

  // Check if an index is in the set
  has(index: number): boolean {
    return this.set.has(index);
  }

  // Get all values as an array (if needed)
  values(): number[] {
    return [...this.list];
  }
}
