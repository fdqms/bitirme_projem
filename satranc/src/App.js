import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import Game from './Game';
import AiGame from './AiGame';
import { Grid, Header, Divider, Input, Table, Button, Icon, Pagination } from 'semantic-ui-react';
import { api, stream } from './Api';

function App(props) {

  const { notations } = useSelector((state) => state);

  const [initial, setInitial] = useState(false);
  const [gameId, setGameId] = useState(0);
  const [myColor, setMyColor] = useState(true);
  const [orderColor, setOrderColor] = useState(false);

  const [activeNotationPage, setActiveNotationPage] = useState(1);

  const [whiteTime, setWhiteTime] = useState(180);
  const [blackTime, setBlackTime] = useState(180);

  useEffect(() => {

    stream.on('data', (data) => {
      if (data.getGameId() > 0 && data.getX() === 0) {
        setInitial(true);
      }
    });

    if (initial) {
      const interval = setInterval(() => {
        if (orderColor) {
          setBlackTime(blackTime - 1);
        } else {
          setWhiteTime(whiteTime - 1);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [whiteTime, blackTime, orderColor, initial]);

  const convertTime = (time) => {
    const minute = Math.floor(time / 60);
    const second = time % 60;
    return minute + ":" + (second < 10 ? "0" + second : second);
  }

  if (!initial) {
    return <Button.Group className='gameMenu' vertical labeled icon>
      <Button icon='plus' content='Oluştur' color='green' onClick={(e) => {
        e.preventDefault();
        if (gameId === 0) {
          api.createGame().then(val => {
            setGameId(val);
            setMyColor(false);
          });
        }
      }} />
      <Divider content='veya' horizontal clearing />
      <Button icon='search' content='Ara' color='yellow' onClick={(e) => {
        e.preventDefault();
        api.searchGame().then(val => {
          setGameId(val);
          setMyColor(true);
          setInitial(val > 0);
        });
      }} />
    </Button.Group>;
  }

  return <Grid style={{ height: '100vh' }}>
    <Grid.Row>
      <Grid.Column width={3} style={{ padding: '20px' }} textAlign='center'>
        <Header as='h5' padding={0}> 123 </Header>
        <Header as='h3'> USER </Header>
        <Divider horizontal content='VS' />
        <Header as='h3' > FDQMS </Header>
        <Header as='h5' padding={0}> 1998 </Header>
        <Divider section />
        <Header as='h3' textAlign='center'> MESAJLAR </Header>
        <Input
          icon={{ name: 'paper plane outline', circular: true, link: true }}
          placeholder='Mesaj yaz'
        />
      </Grid.Column>
      <Grid.Column width={10}>
        {
          props.ai ? <AiGame /> : <Game setParentOrder={setOrderColor} setWhiteTime={setWhiteTime} setBlackTime={setBlackTime} gameId={gameId} myColor={myColor} />
        }
      </Grid.Column>
      <Grid.Column width={3} style={{ padding: '20px' }} textAlign='center'>
        <Header as='h3' padding={0}>Beyaz</Header>
        <Header as='h4' id="whiteTime">{convertTime(whiteTime)}</Header>
        <Divider horizontal><Icon name='clock outline' size='big' /></Divider>
        <Header as='h4' id="blackTime">{convertTime(blackTime)}</Header>
        <Header as='h3' padding={0}>Siyah</Header>
        <Divider />
        <Header as='h3' textAlign='center'> HAMLELER </Header>
        <Divider hidden />
        <Table celled compact='very'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Sıra</Table.HeaderCell>
              <Table.HeaderCell>Beyaz</Table.HeaderCell>
              <Table.HeaderCell>Siyah</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              notations.slice(5 * (activeNotationPage - 1), 5 * activeNotationPage).map((notation, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1 + 5 * (activeNotationPage - 1)}</Table.Cell>
                  <Table.Cell>{notation.white}</Table.Cell>
                  <Table.Cell>{notation.black}</Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='3'>
                <Pagination
                  boundaryRange={0}
                  defaultActivePage={1}
                  siblingRange={1}
                  totalPages={1 + (((notations.length - 1) / 5) >> 0)}
                  nextItem={{ content: <Icon name='angle right' />, icon: true }}
                  prevItem={{ content: <Icon name='angle left' />, icon: true }}
                  ellipsisItem={null}
                  firstItem={null}
                  lastItem={null}
                  onPageChange={(event, data) => {
                    setActiveNotationPage(data.activePage);
                  }}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <Divider hidden />
        <Button.Group>
          <Button color='yellow'>Beraberlik</Button>
          <Button color='red'>Geri çekil</Button>
        </Button.Group>
      </Grid.Column>
    </Grid.Row>
  </Grid>
}


export default App;