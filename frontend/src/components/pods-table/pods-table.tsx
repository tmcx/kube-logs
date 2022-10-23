import { Component } from 'react';
import { Pod, PodsService } from '../../services/pods.service';
import './pods-table.css';



export default class PodsTable extends Component {
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
    console.log(pods);
    this.setState({ pods });
  }

  render() {
    return (
      <table border={1}>
        <thead>
          <tr>
            <th>Namespace</th>
            <th>Name</th>
            <th>Containers</th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.pods.map((pod) => (
              <tr key={pod.name}>
                <td>{pod.namespace}</td>
                <td>{pod.name}</td>
                <td>
                  {
                    pod.containers.map((container) => (
                        <div key={container.name}>
                          {container.name}  {container.status}
                        </div>)
                    )
                  }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    )
  }
}
