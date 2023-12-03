import {Server} from 'logic/servers'
import * as Styled from './styles'

type ServersListProps = {
  list: Server[]
}

export const ServersList = ({list}: ServersListProps) => (
  <Styled.Wrapper>
    {list.map(server => (
      <Styled.Item key={server.ip}>
        <Styled.Online className={server.online ? 'active' : undefined} />

        <div>
          <div>{server.ip} {server.master && '(master)'}</div>
          <div>{server.free}/{server.total}</div>
        </div>
      </Styled.Item>
    ))}
  </Styled.Wrapper>
)
