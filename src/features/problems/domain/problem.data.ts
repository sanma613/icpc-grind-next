import { Problem } from "./problem.types";

export const initialProblems: Problem[] = [
  {
    id: 1,
    name: "Flight Discount",
    topic: "graphs",
    difficulty: "medium",
    source: "CSES",
    year: 2020,
    link: "https://cses.fi/problemset/task/1195",
    description: "Modified Dijkstra algorithm on a state graph (coupon applied vs. unused)."
  },
  {
    id: 2,
    name: "Point Location Test",
    topic: "geometry",
    difficulty: "easy",
    source: "CSES",
    year: 2020,
    link: "https://cses.fi/problemset/task/2189",
    description: "2D cross product sign analysis to determine point orientation relative to a directed line."
  },
  {
    id: 3,
    name: "Planets and Kingdoms",
    topic: "graphs",
    difficulty: "medium",
    source: "CSES",
    year: 2021,
    link: "https://cses.fi/problemset/task/1683",
    description: "Strongly Connected Components (SCC) identification and condensation via Kosaraju or Tarjan."
  },
  {
    id: 4,
    name: "Convex Hull",
    topic: "geometry",
    difficulty: "hard",
    source: "CSES",
    year: 2022,
    link: "https://cses.fi/problemset/task/2195",
    description: "Convex hull construction in O(N log N) using Andrew's Monotone Chain or Graham Scan."
  },
  {
    id: 5,
    name: "Road Reparation",
    topic: "graphs",
    difficulty: "easy",
    source: "CSES",
    year: 2020,
    link: "https://cses.fi/problemset/task/1675",
    description: "Standard Minimum Spanning Tree (MST) solved with Kruskal's algorithm and Disjoint Set Union (DSU)."
  },
  {
    id: 6,
    name: "Polygon Area",
    topic: "geometry",
    difficulty: "easy",
    source: "CSES",
    year: 2020,
    link: "https://cses.fi/problemset/task/2191",
    description: "Shoelace formula (Gauss area formula) implementation for simple polygon vertex sequences."
  }
];
