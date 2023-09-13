import hash, { type NotUndefined } from 'object-hash'

class SlowMap<K, V> {
  map: Map<string, V>
  reverseKey: Map<string, K>

  constructor() {
    this.map = new Map()
    this.reverseKey = new Map()
  }

  _hash(key: K) {
    return hash(key as NotUndefined)
  }

  set(key: K, value: V) {
    const hashed = this._hash(key)
    this.map.set(hashed, value)
    this.reverseKey.set(hashed, key)
  }

  get(key: K): V | undefined {
    const hashed = this._hash(key)
    return this.map.get(hashed)
  }

  emplace(key: K, init: V, update: (value: V) => void) {
    const hashed = this._hash(key)
    const value = this.map.get(hashed)
    if (value) {
      update(value)
    } else {
      this.map.set(hashed, init)
      this.reverseKey.set(hashed, key)
    }
  }

  delete(key: K) {
    const hashed = this._hash(key)
    this.map.delete(hashed)
    this.reverseKey.delete(hashed)
  }

  forEach(callback: (value: V) => void): void {
    this.map.forEach((value) => callback(value))
  }

  entries(): [K, V][] {
    return Array.from(this.map, ([hashed, value]) => {
      return [this.reverseKey.get(hashed)!, value]
    })
  }
}

export default SlowMap