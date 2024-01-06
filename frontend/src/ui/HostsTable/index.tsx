import {observer} from 'mobx-react-lite'
import {Link} from 'wouter'
import {Icon} from 'ui/Icon'
import {Host, HostsStore} from 'logic/hosts'
import * as Styled from './styles'

type HostsTableProps = {
  list: Host[]
  remove: HostsStore['removeItem']
}

export const HostsTable = observer(({list, remove}: HostsTableProps) => (
  <>
    <Styled.Header>
      <Link to="/create-host">Create Host</Link>
    </Styled.Header>

    {list.length
      ? (
        <Styled.Table>
          <thead>
            <tr>
              <th>Host</th>
              <th>Ip</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(row => (
              <tr key={row.id}>
                <td data-label="Host">{row.host}</td>
                <td data-label="Ip">{row.ip}</td>
                <td>
                  <Styled.BtnGroup>
                    <Styled.Btn onClick={() => remove(row.id)}>
                      <Icon name="remove" width="16" height="16" fill="#FFF" />
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
              <th>1-{list.length} of {list.length}</th>
            </tr>
          </tfoot>
        </Styled.Table>
      )
      : <div>Hosts not found</div>}
  </>
))
