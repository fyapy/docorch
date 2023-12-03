import {observer} from 'mobx-react-lite'
import {useStore} from 'utils/hooks'
import {color} from 'ui/theme'
import {Icon} from 'ui/Icon'
import * as Styled from './styles'

export const NotificationLayout = observer(() => {
  const {notifications} = useStore()

  return (
    <Styled.Absolute>
      {notifications.allList.map(notify => (
        <Styled.Notification key={notify.id}>
          {notify.text}
          <Icon
            name="remove"
            width="16"
            height="16"
            fill={color.danger}
            onClick={() => notifications.removeNotify(notify.id)}
          />
        </Styled.Notification>
      ))}
    </Styled.Absolute>
  )
})
