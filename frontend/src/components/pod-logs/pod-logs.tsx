import { Component } from 'react';
import { Pod, PodsService } from '../../services/pods.service';
import './pod-logs.css';



export default class PodLogs extends Component {
  podService: PodsService;
  state: { pods: Pod[] };

  constructor(props: any) {
    super(props);
    this.podService = new PodsService();
    this.state = { pods: [] }
  }

  componentDidMount(): void {
    this.getData();
  }

  async getData() {
    const pods = await this.podService.get();
    this.setState({ pods });
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Namespace</th>
            <th>Name</th>
            <th>Status</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.pods.map((pod) => (
              <tr key={pod.name}>
                <td>{pod.namespace}</td>
                <td>{pod.name}</td>
                <td>{pod.status}</td>
                <td>{pod.age}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    )
  }
}



