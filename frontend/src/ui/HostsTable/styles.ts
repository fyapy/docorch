import {styled} from 'styled-components'
import {color} from 'ui/theme'

export const Header = styled.div`
  margin-bottom: 20px;

  display: flex;
  justify-content: flex-end;

  a {
    padding: 6px 8px;
    font-weight: 600;
    border-radius: 3px;
    border: 1px solid #1E8F63;
    background-color: #26BA81;
    color: #fff;

    &:hover {
      background-color: ${color.primary};
      border-color: ${color.primary};
    }
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  border: 1px solid #BCC4D2;
  border-radius: 3px;

  thead, tfoot {
    background-color: #F5F5F5;

    tr {
      height: 45px;

      th {
        padding: 0 10px 0 20px;

        text-align: left;
        color: #898989;
        font-weight: 400;
      }
    }
  }
  tfoot tr th {
    text-align: right;
  }
  tbody tr {
    height: 55px;

    border: 1px solid #BCC4D2;

    td {
      padding: 0 10px 0 20px;

      &:nth-child(1) {
        font-weight: 600;
      }
    }
  }
`

export const BtnGroup = styled.div`
  display: flex;
  column-gap: 8px;
`

export const Btn = styled.button`
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #1E8F63;
  background-color: #26BA81;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: ${color.primary};
    border-color: ${color.primary};
  }
  &:disabled {
    background-color: #BCC4D2;
    border-color: #BCC4D2;
  }
`
