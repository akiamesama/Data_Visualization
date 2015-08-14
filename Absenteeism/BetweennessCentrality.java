import java.util.LinkedList;
import java.util.Queue;

public class BetweennessCentrality {
	
	public void SPs(int[][] path, int[][] dist, int[][] count) {
		int m = path.length;
		int n = path[0].length;
		
		for(int i = 0; i < m; i++) {
			for(int j = 0; j < n; j++) {
				dist[i][j] = Integer.MAX_VALUE;
				count[i][j] = 0;
			}
		}
		
		for(int i = 0; i < m; i++) {
			int[] visited = new int[m];
			visited[i] = 1;
			dist[i][i] = 0;
			count[i][i] = 1;
			Queue<Integer> queue = new LinkedList<Integer>();
			queue.offer(i);
			while(!queue.isEmpty()) {
				int size = queue.size();
				for(int j = 0; j < size; j++) {
					int cur_city = queue.poll();
					visited[cur_city] = 1;
					for(int k = 0; k < m; k++) {
						if(cur_city != k && path[cur_city][k] == 1) {
							if(visited[k] == 0) {
								dist[i][k] = dist[i][cur_city] + 1;
								count[i][k] = count[i][cur_city];
								visited[k] = 1;
								queue.offer(k);
							} else {
								if(dist[i][k] == dist[i][cur_city] + 1) {
									count[i][k] += count[i][cur_city];
								} else if(dist[i][k] >  dist[i][cur_city] + 1) {
									dist[i][k] = dist[i][cur_city] + 1;
									count[i][k] = count[i][cur_city];
								}
							}
						}
					}
				}
			}
		}
	}
	
	public double[] calculateBC(int[][] dist, int[][] count) {
		int n = dist.length;
		double[] rs = new double[n];
		for(int i = 0; i < n; i++) {
			double cur_bc = 0;
			for(int j = 0; j < n; j++) {
				if(i == j) {
					continue;
				}
				for(int k = 0; k < n; k++) {
					if(i == k) {
						continue;
					}
					if(dist[j][k] == dist[j][i] + dist[i][k]) {
						double all_paths = count[j][k];
						double paths_throughCur = count[j][i] * count[i][k];
						cur_bc += paths_throughCur / all_paths;
					}
				}
			}
			rs[i] = cur_bc;
		}
		return rs;
	}
}
