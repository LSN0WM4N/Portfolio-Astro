import type { Vector } from "../types/physics";
import type { Edge, Node, Project } from "../types/projects";

class GraphManager {
  private nodes: Node<Project>[] = [];
  private edges: Edge[] = [];
  private time: number = 0;

  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  addNode(x: number, y: number, data: Project) {
    const id = this.nodes.length + 1;

    this.nodes.push({
      id,
      coords: { x, y },
      data,
      force: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 }
    });
  }

  addEdge(from: number, to: number) {
    if (from === to) return;

    if (this.edges.some(e => e.from === from && e.to === to)) return;

    this.edges.push({ from, to });
  }

  private applyForce(node: Node<Project>, force: Vector) {
    node.force.x += force.x;
    node.force.y += force.y;
  }

  private applyRepulsion() {
    const strength = 400;

    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const a = this.nodes[i];
        const b = this.nodes[j];

        let dx = a.coords.x - b.coords.x;
        let dy = a.coords.y - b.coords.y;

        let dist = Math.sqrt(dx * dx + dy * dy) || 0.01;

        let force = strength / (dist * dist);

        let fx = (dx / dist) * force;
        let fy = (dy / dist) * force;

        this.applyForce(a, { x: fx, y: fy });
        this.applyForce(b, { x: -fx, y: -fy });
      }
    }
  }

  private applyAttraction() {
    const springLength = 120;
    const stiffness = 0.02;

    for (const edge of this.edges) {
      const a = this.nodes.find(n => n.id === edge.from);
      const b = this.nodes.find(n => n.id === edge.to);

      if (!a || !b) continue;

      let dx = b.coords.x - a.coords.x;
      let dy = b.coords.y - a.coords.y;

      let dist = Math.sqrt(dx * dx + dy * dy) || 0.01;

      let force = (dist - springLength) * stiffness;

      let fx = (dx / dist) * force;
      let fy = (dy / dist) * force;

      this.applyForce(a, { x: fx, y: fy });
      this.applyForce(b, { x: -fx, y: -fy });
    }
  }

  private applyBounds(node: Node<Project>) {
    const margin = 50;
    const force = 0.05;

    if (node.coords.x < margin) {
      node.velocity.x += (margin - node.coords.x) * force;
    }

    if (node.coords.x > this.width - margin) {
      node.velocity.x -= (node.coords.x - (this.width - margin)) * force;
    }

    if (node.coords.y < margin) {
      node.velocity.y += (margin - node.coords.y) * force;
    }

    if (node.coords.y > this.height - margin) {
      node.velocity.y -= (node.coords.y - (this.height - margin)) * force;
    }
  }

  move() {
    this.time += 0.01;

    const damping = 0.96;
    const noiseStrength = 0.005;

    for (const node of this.nodes) {
      node.force.x = 0;
      node.force.y = 0;
    }
    this.applyAttraction();
    this.applyRepulsion();

    for (const node of this.nodes) {
      if (node.pinned) {
        node.velocity.x = 0;
        node.velocity.y = 0;
        continue;
      }

      const angle =
        Math.sin(this.time + node.id) +
        Math.cos(this.time * 0.7 + node.id * 2);

      const fx = Math.cos(angle) * noiseStrength;
      const fy = Math.sin(angle) * noiseStrength;

      node.velocity.x += fx;
      node.velocity.y += fy;

      node.velocity.x *= damping;
      node.velocity.y *= damping;

      node.coords.x += node.velocity.x;
      node.coords.y += node.velocity.y;

      this.applyBounds(node);
    }
  }

  hitTestNode(x: number, y: number, radius = 50) {
    return this.nodes.find(node => {
      const dx = node.coords.x - x;
      const dy = node.coords.y - y;

      return dx * dx + dy * dy <= radius * radius;
    });
  }
  
  togglePin(id: number) {
    const node = this.nodes.find(n => n.id === id);
    if (!node) return;

    node.pinned = !node.pinned;

    if (node.pinned) {
      node.velocity.x = 0;
      node.velocity.y = 0;
    }
  }

  getNodes() {
    return this.nodes;
  }

  getEdges() {
    return this.edges;
  }
}

export default GraphManager;