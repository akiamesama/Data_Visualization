import edu.uci.ics.jung.graph.Graph;
import edu.uci.ics.jung.graph.SparseMultigraph;

public class Main {

	public static void main(String[] args) {
//		Graph graph = new SparseMultigraph<Vertex, String>();
//		Vertex v1 = new Vertex("Anna");
//		Vertex v2 = new Vertex("Ben");
//		Vertex v3 = new Vertex("Cara");
//		Vertex v4 = new Vertex("Dana");
//		Vertex v5 = new Vertex("Evan");
//		Vertex v6 = new Vertex("Frank");
//		graph.addEdge("ab", v1, v2);
//		graph.addEdge("ac", v1, v3);
//		graph.addEdge("cd", v3, v4);
//		graph.addEdge("ce", v3, v5);
//		graph.addEdge("de", v4, v5);
//		graph.addEdge("df", v4, v6);
//		graph.addEdge("ef", v5, v6);
//		BetweennessCentrality bc = new BetweennessCentrality(graph);
//		System.out.println(bc.getVertexScore(v1));
//		System.out.println(bc.getVertexScore(v2));
//		System.out.println(bc.getVertexScore(v3));
//		System.out.println(bc.getVertexScore(v4));
//		System.out.println(bc.getVertexScore(v5));
//		System.out.println(bc.getVertexScore(v6));
		
		int[][] path = new int[6][6];
		path[0][1] = 1;
		path[1][0] = 1;
		path[0][2] = 1;
		path[2][0] = 1;
		path[2][3] = 1;
		path[3][2] = 1;
		path[2][4] = 1;
		path[4][2] = 1;
		path[3][4] = 1;
		path[4][3] = 1;
		path[3][5] = 1;
		path[5][3] = 1;
		path[4][5] = 1;
		path[5][4] = 1;
		BetweennessCentrality bc = new BetweennessCentrality();
		int[][] dist = new int[6][6];
		int[][] count = new int[6][6];
		bc.SPs(path, dist, count);
		for(int i = 0; i < dist.length; i++) {
			for(int j = 0; j < dist[0].length; j++) {
				System.out.print(dist[i][j] + " ");
			}
			System.out.println();
		}
		System.out.println();
		for(int i = 0; i < count.length; i++) {
			for(int j = 0; j < count[0].length; j++) {
				System.out.print(count[i][j] + " ");
			}
			System.out.println();
		}
		
		double[] bcValue = bc.calculateBC(dist, count);
		for(int i = 0; i < bcValue.length; i++) {
			System.out.print(bcValue[i]);
			System.out.print(" ");
		}
	}
}