/* eslint-disable */

import React, { useState } from "react";
import { useSelector } from 'react-redux';
// import Chart from './Chart';
import {
    useParams
} from 'react-router-dom';
import { Grid, Menu, Image, Header, Form, TextArea, Input, Select, Table, Pagination, Icon } from 'semantic-ui-react';

function Profile() {
    let { id } = useParams();
    const [activeItem = 'Hesap', setActiveItem] = useState();

    const { auth } = useSelector(state => state);

    if(!auth){
        return <></>
    }

    return <Grid style={{ height: '100vh' }} padded='vertically'>
        <Grid.Row>
            <Grid.Column width={3} textAlign='center'>
                <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' size='small' circular centered />
                <Header as='h2'>FDQMS</Header>
                <Header as='h5' style={{ margin: '0', color: '#d0d0d0' }}>Computer Engineer</Header>
                <Menu fluid vertical tabular>
                    <Menu.Item
                        name='Hesap'
                        active={activeItem === 'Hesap'}
                        onClick={
                            (_, { name }) => setActiveItem(name)
                        }
                    />
                    <Menu.Item
                        name='Maçlar'
                        active={activeItem === 'Maçlar'}
                        onClick={
                            (_, { name }) => setActiveItem(name)
                        }
                    />
                    <Menu.Item
                        name='İstatistik'
                        active={activeItem === 'İstatistik'}
                        onClick={
                            (_, { name }) => setActiveItem(name)
                        }
                    />
                    <Menu.Item
                        name='Ayarlar'
                        active={activeItem === 'Ayarlar'}
                        onClick={
                            (_, { name }) => setActiveItem(name)
                        }
                    />
                </Menu>
            </Grid.Column>
            <Grid.Column width={12}>
                {
                    content(activeItem)
                }
            </Grid.Column>
        </Grid.Row>
    </Grid>
}

const countries = [
    { key: 'tr', value: 'tr', text: 'Türkiye' },
    { key: 'az', value: 'az', text: 'Azerbaycan' }
];

function content(item) {

    const option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }
        ]
    };

    switch (item) {
        case 'Hesap':
            return <Grid padded>
                <Grid.Row>
                    <Header as='h3'>
                        Temel Bilgiler
                    </Header>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column width={6}>
                        <Header as='h5' style={{ color: '#7f7f7f' }}>Ad</Header>
                        <Input fluid placeholder='Adınızı giriniz' />
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Header as='h5' style={{ color: '#7f7f7f' }}>Soyad</Header>
                        <Input fluid placeholder='Soyadınızı giriniz' />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Header as='h5' style={{ color: '#7f7f7f' }}>E-posta</Header>
                        <Input fluid placeholder='E-posta adresinizi giriniz' />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Header as='h3'>
                        Hakkımda
                    </Header>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Header as='h5' style={{ color: '#7f7f7f' }}>Biyografi</Header>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Header as='h5' style={{ color: '#7f7f7f' }}>Ülke</Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Form>
                            <TextArea style={{ resize: 'none' }} placeholder='Biyografiniz hakkında bir kaç cümle giriniz' />
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Select fluid placeholder='Ülkenizi seçin' options={countries} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Header as='h3'>
                        Dış bağlantılar
                    </Header>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Header as='h5' style={{ color: '#7f7f7f' }}>LinkedIn</Header>
                        <Input fluid placeholder='LinkedIn bağlantınızı giriniz' />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Header as='h5' style={{ color: '#7f7f7f' }}>Google+</Header>
                        <Input fluid placeholder='Google+ bağlantınızı giriniz' />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Header as='h5' style={{ color: '#7f7f7f' }}>Instagram</Header>
                        <Input fluid placeholder='Instagram bağlantınızı giriniz' />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        case 'Maçlar':
            return <>
                <Table padded color={'grey'} key={'grey'} celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell collapsing>ID</Table.HeaderCell>
                            <Table.HeaderCell>Beyaz</Table.HeaderCell>
                            <Table.HeaderCell>Siyah</Table.HeaderCell>
                            <Table.HeaderCell>Kazanan</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell selectable><a href="#">1</a></Table.Cell>
                            <Table.Cell positive>FDQMS</Table.Cell>
                            <Table.Cell negative>User</Table.Cell>
                            <Table.Cell>Beyaz</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell selectable><a href="#">2</a></Table.Cell>
                            <Table.Cell positive>User</Table.Cell>
                            <Table.Cell negative>FDQMS</Table.Cell>
                            <Table.Cell>Siyah</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell selectable><a href="#">3</a></Table.Cell>
                            <Table.Cell negative>User</Table.Cell>
                            <Table.Cell positive>FDQMS</Table.Cell>
                            <Table.Cell>Siyah</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell selectable><a href="#">4</a></Table.Cell>
                            <Table.Cell negative>User</Table.Cell>
                            <Table.Cell positive>FDQMS</Table.Cell>
                            <Table.Cell>Siyah</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell selectable><a href="#">5</a></Table.Cell>
                            <Table.Cell positive>User</Table.Cell>
                            <Table.Cell negative>FDQMS</Table.Cell>
                            <Table.Cell>Beyaz</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell selectable><a href="#">6</a></Table.Cell>
                            <Table.Cell negative>User</Table.Cell>
                            <Table.Cell positive>FDQMS</Table.Cell>
                            <Table.Cell>Siyah</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell selectable><a href="#">7</a></Table.Cell>
                            <Table.Cell negative>User</Table.Cell>
                            <Table.Cell positive>FDQMS</Table.Cell>
                            <Table.Cell>Siyah</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell selectable><a href="#">8</a></Table.Cell>
                            <Table.Cell negative>User</Table.Cell>
                            <Table.Cell positive>FDQMS</Table.Cell>
                            <Table.Cell>Siyah</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell selectable><a href="#">9</a></Table.Cell>
                            <Table.Cell negative>User</Table.Cell>
                            <Table.Cell positive>FDQMS</Table.Cell>
                            <Table.Cell>Siyah</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell selectable><a href="#">10</a></Table.Cell>
                            <Table.Cell negative>User</Table.Cell>
                            <Table.Cell positive>FDQMS</Table.Cell>
                            <Table.Cell>Siyah</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell selectable><a href="#">11</a></Table.Cell>
                            <Table.Cell negative>User</Table.Cell>
                            <Table.Cell positive>FDQMS</Table.Cell>
                            <Table.Cell>Siyah</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell selectable><a href="#">11</a></Table.Cell>
                            <Table.Cell negative>User</Table.Cell>
                            <Table.Cell positive>FDQMS</Table.Cell>
                            <Table.Cell>Siyah</Table.Cell>
                        </Table.Row>
                    </Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='3'>
                                <Pagination
                                    boundaryRange={0}
                                    defaultActivePage={1}
                                    siblingRange={4}
                                    totalPages={22}
                                    nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                    prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                    ellipsisItem={null}
                                    firstItem={null}
                                    lastItem={null}
                                    onPageChange={(event, data) => {
                                        console.log(data);
                                    }}
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </>

        case 'İstatistik':
            return <Grid>
                <Grid.Row>
                    
                    <Grid.Column width={12}>
                    <Header as='h3'>
                Ayarlar
            </Header>
                        { /* <Chart options={option} /> */ }
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        case 'Ayarlar':
            return <Header as='h3'>
                Ayarlar
            </Header>
            break;
        default:
            return <Header as='h3'>
                Hata
            </Header>
    }
}

export default Profile;