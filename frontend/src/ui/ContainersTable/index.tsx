import {observer} from 'mobx-react-lite'
import {Link} from 'wouter'
import {Icon} from 'ui/Icon'
import {
  Container,
  ContainersStore,
} from 'logic/containers'
import {ServersList} from 'ui/ServersList'
import {Server} from 'logic/servers'
import * as Styled from './styles'

type ContainersTableProps = {
  servers: Server[]
  list: Container[]
  pendings: string[]
  action: ContainersStore['containerAction']
}

export const ContainersTable = observer(({list, servers, pendings, action}: ContainersTableProps) => (
  <>
    <Styled.Header>
      <Link to="/create-container">Create Container</Link>
    </Styled.Header>

    <ServersList list={servers} />

    {list.length
      ? (
        <Styled.Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Server</th>
              <th>Status</th>
              <th>Image</th>
              <th>Ports</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(row => {
              const disabled = pendings.includes(row.id) || pendings.includes(row.name)

              return (
                <tr key={row.id}>
                  <td data-label="Name">{row.name}</td>
                  <td data-label="Server">{row.serverIp}</td>
                  <td data-label="Status" style={{minWidth: 120}}>
                    <Styled.State data-state={row.docker?.state || 'exited'}>
                      {row.docker?.state || 'docker container not found'}
                    </Styled.State>
                  </td>
                  <td data-label="Image">{row.image}</td>
                  <td data-label="Ports" style={{minWidth: 80}}>{row.networks.map(port => `${port.static}:${port.to}`).join(', ')}</td>
                  <td>
                    <Styled.BtnGroup>
                      {row.docker?.state === 'exited' && (
                        <Styled.Btn disabled={disabled} onClick={() => action(row.id, 'start')}>
                          <Icon name="play" width="16" height="16" fill="#FFF" />
                        </Styled.Btn>
                      )}
                      {row.docker?.state === 'running' && (
                        <Styled.Btn disabled={disabled} onClick={() => action(row.id, 'stop')}>
                          <Icon name="stop" width="16" height="16" fill="#FFF" />
                        </Styled.Btn>
                      )}
                      <Styled.Btn disabled={disabled} onClick={() => action(row.name, 'recreate')}>
                        <Icon name="restart" width="16" height="16" fill="#FFF" />
                      </Styled.Btn>
                      <Styled.Btn disabled={disabled} onClick={() => action(row.id, 'remove')}>
                        <Icon name="remove" width="16" height="16" fill="#FFF" />
                      </Styled.Btn>
                    </Styled.BtnGroup>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <th></th>
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
