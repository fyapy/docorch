import {observer} from 'mobx-react-lite'
import {Link} from 'wouter'
import {Icon} from 'ui/Icon'
import {
  Container,
  ContainersStore,
} from 'logic/containers'
import * as Styled from './styles'

type ContainersTableProps = {
  list: Container[]
  pendings: string[]
  action: ContainersStore['containerAction']
}

export const ContainersTable = observer(({list, pendings, action}: ContainersTableProps) => (
  <>
    <Styled.Header>
      <Link to="/run-container">Run Container</Link>
    </Styled.Header>

    {list.length
      ? (
        <Styled.Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Image</th>
              <th>Ports</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(row => (
              <tr key={row.id}>
                <td data-label="Name">{row.name}</td>
                <td data-label="Status" style={{minWidth: 120}}>
                  <Styled.State data-state={row.state}>{row.state}</Styled.State>
                </td>
                <td data-label="Image">{row.image}</td>
                <td data-label="Ports" style={{minWidth: 80}}>{row.ports.map(port => `${port.static}:${port.to}`).join(', ')}</td>
                <td>
                  <Styled.BtnGroup>
                    {row.state === 'exited' && (
                      <Styled.Btn
                        disabled={pendings.includes(row.id)}
                        onClick={() => action(row.id, 'start')}
                      >
                        <Icon name="play" width="16" height="16" fill="#FFF" />
                      </Styled.Btn>
                    )}
                    {row.state === 'running' && (
                      <Styled.Btn
                        disabled={pendings.includes(row.id)}
                        onClick={() => action(row.id, 'stop')}
                      >
                        <Icon name="stop" width="16" height="16" fill="#FFF" />
                      </Styled.Btn>
                    )}
                    <Styled.Btn
                      disabled={pendings.includes(row.id)}
                      onClick={() => action(row.id, 'remove')}
                    >
                      <Icon name="stop" width="16" height="16" fill="#FFF" />
                    </Styled.Btn>
                  </Styled.BtnGroup>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th>1-{list.length} of {list.length}</th>
            </tr>
          </tfoot>
        </Styled.Table>
      )
      : <div>Containers not found</div>}
  </>
))
