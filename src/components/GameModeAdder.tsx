/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Button, Dropdown, Input, Menu, Modal, Radio, RadioChangeEvent, Select, Table, Tabs } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import testData from "./testData.json"

interface Team {
    rule: string;
    team: number | string | { round: string; group: string; team: number };
}

interface Group {
    name: string;
    teams: Team[];
    results?: Team[];
}

interface ScheduleMatch {
    group: string;
    teamA: number | string | { round: string; group: string; team: number };
    teamB: number | string | { round: string; group: string; team: number };
}

interface Round {
    name: string;
    groups: Group[];
    schedule: ScheduleMatch[];
}

const GameModeAdder: React.FC = () => {

    const [data, setData] = useState<Round[]>(testData);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [newRoundName, setNewRoundName] = useState<string>('');
    const [selectedRoundName, setSelectedRoundName] = useState<string | null>(null); // Change here
    const [newGroupName, setNewGroupName] = useState<string>('');
    const [newTeamNames, setNewTeamNames] = useState<string[]>(Array(data.length).fill(''));
    const [newTeamType, setNewTeamType] = useState<'team' | 'rank'>('team');
    const [selectedRoundForRank, setSelectedRoundForRank] = useState<string | null>(null);
    const [selectedGroupForRank, setSelectedGroupForRank] = useState<string | null>(null);
    const [rankOptions, setRankOptions] = useState<number[]>([]);
    const [availableRoundsForRank, setAvailableRoundsForRank] = useState<string[]>([]);
    const [selectedGroupForSchedule, setSelectedGroupForSchedule] = useState<string | null>(null);
    const [selectedTeamA, setSelectedTeamA] = useState<number | string | { round: string; group: string; team: number } | null>(null);
    const [selectedTeamB, setSelectedTeamB] = useState<number | string | { round: string; group: string; team: number } | null>(null);

    const columns = [
        {
            title: 'Match',
            dataIndex: 'matchIndex',
            key: 'matchIndex',
        },
        {
            title: 'Group',
            dataIndex: 'group',
            key: 'group',
        },
        {
            title: 'Team A',
            dataIndex: 'teamA',
            key: 'teamA',
        },
        {
            title: 'Team B',
            dataIndex: 'teamB',
            key: 'teamB',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text: any, record: any) => (
                <Button type='default' icon={<DeleteOutlined />} style={{ color: 'red' }} onClick={() => handleDeleteMatch(record.key)} />
            ),
        },
    ];

    const handleTeamAChange = (value: string | { round: string; group: string; team: number } | number) => {
        setSelectedTeamA(value);
    };

    const handleTeamBChange = (value: string | { round: string; group: string; team: number } | number) => {
        setSelectedTeamB(value);
    };

    const handleGroupForScheduleChange = (value: string) => {
        setSelectedGroupForSchedule(value);
    };

    const handleAddMatch = () => {
        if (selectedRoundName && selectedGroupForSchedule !== null && selectedTeamA !== null && selectedTeamB !== null) {
            const round = data.find((r) => r.name === selectedRoundName);
            const group = round?.groups.find((g) => g.name === selectedGroupForSchedule);

            console.log(selectedRoundName, selectedGroupForSchedule, selectedTeamA, selectedTeamB);

            if (round && group) {
                const newMatch: ScheduleMatch = {
                    group: selectedGroupForSchedule,
                    teamA: selectedTeamA,
                    teamB: selectedTeamB,
                };

                const updatedRound: Round = {
                    ...round,
                    schedule: [...round.schedule, newMatch],
                };

                setData((prevData) => prevData.map((r) => (r.name === selectedRoundName ? updatedRound : r)));
            }

            console.log(data)
        }
    };

    const handleDeleteMatch = (matchIndex: number) => {
        if (selectedRoundName) {
            const round = data.find((r) => r.name === selectedRoundName);
            if (round) {
                const updatedRound: Round = {
                    ...round,
                    schedule: round.schedule.filter((_, index) => index !== matchIndex),
                };
                setData((prevData) => prevData.map((r) => (r.name === selectedRoundName ? updatedRound : r)));
            }
        }
    };

    const handleTeamTypeChange = (e: RadioChangeEvent) => {
        setNewTeamType(e.target.value);
    };

    const handleRoundForRankChange = (value: string) => {
        setSelectedRoundForRank(value);
    };

    const handleGroupForRankChange = (value: string) => {
        setSelectedGroupForRank(value);
        const selectedRound = data.find((round) => round.name === selectedRoundForRank);
        const selectedGroup = selectedRound?.groups.find((group) => group.name === value);
        if (selectedGroup) {
            const numberOfTeams = selectedGroup.teams.length;
            setRankOptions([...Array(numberOfTeams).keys()].map((index) => index + 1));
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (newRoundName.trim() !== '') {
            setData((prevData) => [
                ...prevData,
                {
                    name: newRoundName.trim(),
                    groups: [],
                    schedule: [],
                },
            ]);
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDeleteRound = (roundIndex: number) => {
        setData((prevData) => prevData.filter((_, index) => index !== roundIndex));
        setSelectedRoundName(null); // Change here
    };

    const handleRoundClick = (round: Round) => {
        setSelectedRoundName(round.name);
        const roundsBeforeSelected = data.filter((r) => r.name !== round.name).map((r) => r.name);
        setAvailableRoundsForRank(roundsBeforeSelected);
    };

    const handleAddGroup = () => {
        if (newGroupName.trim() !== '') {
            const updatedRound: Round = {
                name: selectedRoundName!, // Change here
                groups: [
                    ...data.find((round) => round.name === selectedRoundName)!.groups, // Change here
                    {
                        name: newGroupName.trim(),
                        teams: [],
                    },
                ],
                schedule: [],
            };
            setData((prevData) =>
                prevData.map((round) => (round.name === selectedRoundName ? updatedRound : round)) // Change here
            );
            setNewGroupName('');
        }
    };

    const handleDeleteGroup = (groupIndex: number) => {
        const updatedRound: Round = {
            name: selectedRoundName!, // Change here
            groups: data.find((round) => round.name === selectedRoundName)!.groups.filter((_, index) => index !== groupIndex), // Change here
            schedule: [],
        };
        setData((prevData) =>
            prevData.map((round) => (round.name === selectedRoundName ? updatedRound : round)) // Change here
        );
    };

    const handleNewTeamNameChange = (groupIndex: number, value: string) => {
        setNewTeamNames((prevNames) => {
            const newNames = [...prevNames];
            newNames[groupIndex] = value;
            return newNames;
        });
    };

    const handleAddTeam = (groupIndex: number) => {
        if (newTeamType === 'team' && newTeamNames[groupIndex].trim() !== '') {
            // Adding a team by name
            const updatedRound: Round = {
                name: selectedRoundName!,
                groups: data.find((round) => round.name === selectedRoundName)!.groups.map((group, index) =>
                    index === groupIndex
                        ? {
                            ...group,
                            teams: [...group.teams, { rule: 'team', team: newTeamNames[groupIndex].trim() }],
                        }
                        : group
                ),
                schedule: [],
            };
            setData((prevData) =>
                prevData.map((round) => (round.name === selectedRoundName ? updatedRound : round))
            );
            setNewTeamNames((prevNames) => {
                const newNames = [...prevNames];
                newNames[groupIndex] = '';
                return newNames;
            });
        } else if (newTeamType === 'rank' && selectedRoundForRank && selectedGroupForRank) {
            // Adding a team by rank
            const selectedRound = data.find((round) => round.name === selectedRoundForRank);
            const selectedGroup = selectedRound?.groups.find((group) => group.name === selectedGroupForRank);

            if (selectedRound && selectedGroup) {
                const updatedRound: Round = {
                    name: selectedRoundName!,
                    groups: data.find((round) => round.name === selectedRoundName)!.groups.map((group, index) =>
                        index === groupIndex
                            ? {
                                ...group,
                                teams: [
                                    ...group.teams,
                                    {
                                        rule: 'rank',
                                        team: {
                                            round: selectedRoundForRank!,
                                            group: selectedGroupForRank!,
                                            team: rankOptions[groupIndex],
                                        },
                                    },
                                ],
                            }
                            : group
                    ),
                    schedule: [],
                };
                setData((prevData) =>
                    prevData.map((round) => (round.name === selectedRoundName ? updatedRound : round))
                );
            }
        }
    };

    const handleDeleteTeam = (groupIndex: number, teamIndex: number) => {
        const updatedRound: Round = {
            name: selectedRoundName!, // Change here
            groups: data.find((round) => round.name === selectedRoundName)!.groups.map((group, index) =>
                index === groupIndex
                    ? {
                        ...group,
                        teams: group.teams.filter((_, index) => index !== teamIndex),
                    }
                    : group
            ),
            schedule: [],
        };
        setData((prevData) =>
            prevData.map((round) => (round.name === selectedRoundName ? updatedRound : round)) // Change here
        );
    };

    const menu = (roundIndex: number) => (
        <Menu>
            <Menu.Item key="delete" onClick={() => handleDeleteRound(roundIndex)}>
                Delete Round
            </Menu.Item>
        </Menu>
    );

    const isFirstRound = selectedRoundName === data[0]?.name;

    const renderTeamInputOrDropdown = (groupIndex: number) => {
        if (isFirstRound) {
            return (
                <Input
                    placeholder='Enter team name'
                    value={newTeamNames[groupIndex]}
                    onChange={(e) => handleNewTeamNameChange(groupIndex, e.target.value)}
                />
            );
        } else {
            // Dropdown for selecting teams from the first round
            const allTeams = data[0]?.groups.flatMap((group) => group.teams.map((team) => team.team));
            return (
                <Select
                    placeholder='Select team'
                    onChange={(value) => setNewTeamNames((prevNames) => {
                        const newNames = [...prevNames];
                        newNames[groupIndex] = value.toString();
                        return newNames;
                    })}
                    className='w-full'
                >
                    {allTeams.map((team, index) => (
                        <Select.Option key={index} value={typeof team === 'object' ? `${team.round} - ${team.group} - ${team.team}` : team}>
                            {typeof team === 'object' ? `${team.round} - ${team.group} - ${team.team}` : team}
                        </Select.Option>
                    ))}
                </Select>
            );
        }
    };

    return (
        <div className='min-h-[70vh]'>
            <div className='flex flex-col'>
                <div className='flex gap-1'>
                    {data.map((round: Round, roundIndex: number) => (
                        <Dropdown key={round.name} overlay={menu(roundIndex)} trigger={['contextMenu']}>
                            <Button
                                type={selectedRoundName === round.name ? 'primary' : 'default'}
                                onClick={() => handleRoundClick(round)}
                                onContextMenu={(e) => e.preventDefault()}
                            >
                                {round.name}
                            </Button>
                        </Dropdown>
                    ))}
                    <Button type='primary' icon={<PlusOutlined />} onClick={showModal} />
                </div>

                <hr className='border border-green-500 mt-4' />

                <Tabs defaultActiveKey="1">
                    <TabPane tab="Groups" key="1">
                        {selectedRoundName && (
                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-wrap gap-4'>
                                    {data.find((round) => round.name === selectedRoundName)!.groups.map((group, groupIndex) => (
                                        <>
                                            <div key={groupIndex} className='border border-green-500 rounded p-4 w-72'>
                                                <div className='flex items-center justify-between'>
                                                    <div className='text-xl'>{group.name}</div>
                                                    <Button
                                                        type='default'
                                                        icon={<DeleteOutlined />}
                                                        style={{ color: 'red' }}
                                                        onClick={() => handleDeleteGroup(groupIndex)}
                                                    />
                                                </div>
                                                <hr className='border my-3' />
                                                {group.teams.map((team, teamIndex) => (
                                                    <div key={teamIndex} className='my-4 flex items-center justify-between'>
                                                        {typeof team.team === 'object'
                                                            ? `${team.team.round} - ${team.team.group} - ${team.team.team}`
                                                            : team.team}{' '}
                                                        <Button
                                                            type='default'
                                                            icon={<DeleteOutlined />}
                                                            style={{ color: 'red' }}
                                                            onClick={() => handleDeleteTeam(groupIndex, teamIndex)}
                                                        />
                                                    </div>
                                                ))}
                                                <div className='flex flex-col gap-1'>
                                                    <div className='flex gap-4'>
                                                        <Radio.Group onChange={handleTeamTypeChange} value={newTeamType}>
                                                            <Radio value='team'>Choose Team</Radio>
                                                            <Radio value='rank'>Choose Rank</Radio>
                                                        </Radio.Group>
                                                    </div>
                                                    <div>
                                                        {newTeamType === 'team' && renderTeamInputOrDropdown(groupIndex)}
                                                    </div>
                                                    <div>
                                                        {newTeamType === 'rank' && (
                                                            <div className='flex flex-col gap-1 w-full'>
                                                                <Select
                                                                    placeholder='Select round'
                                                                    onChange={handleRoundForRankChange}
                                                                    value={selectedRoundForRank}
                                                                >
                                                                    {availableRoundsForRank.map((round) => (
                                                                        <Select.Option key={round} value={round}>
                                                                            {round}
                                                                        </Select.Option>
                                                                    ))}
                                                                </Select>
                                                                {selectedRoundForRank && (
                                                                    <>
                                                                        <Select
                                                                            placeholder='Select group'
                                                                            onChange={handleGroupForRankChange}
                                                                            value={selectedGroupForRank}
                                                                        >
                                                                            {data
                                                                                .find((round) => round.name === selectedRoundForRank)
                                                                                ?.groups.map((group) => (
                                                                                    <Select.Option key={group.name} value={group.name}>
                                                                                        {group.name}
                                                                                    </Select.Option>
                                                                                ))}
                                                                        </Select>
                                                                        {selectedGroupForRank && (
                                                                            <Select
                                                                                placeholder='Select rank'
                                                                                onChange={(value) => setRankOptions([value])}
                                                                                value={rankOptions[0]}
                                                                            >
                                                                                {rankOptions.map((rank) => (
                                                                                    <Select.Option key={rank} value={rank}>
                                                                                        {rank}
                                                                                    </Select.Option>
                                                                                ))}
                                                                            </Select>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button type='primary' onClick={() => handleAddTeam(groupIndex)}>
                                                        Add Team
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
                                    ))}
                                    <div className='flex flex-col justify-center items-center gap-4 border border-green-500 w-72 p-4'>
                                        <Input
                                            placeholder='Enter group name'
                                            value={newGroupName}
                                            onChange={(e) => setNewGroupName(e.target.value)}
                                        />
                                        <Button type='primary' onClick={handleAddGroup} className='w-full'>
                                            Add Group
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabPane>
                    <TabPane tab="Schedule" key="2">
                        {selectedRoundName && (
                            <div className='flex flex-col gap-4'>
                                <Table
                                    dataSource={data
                                        .find((round) => round.name === selectedRoundName)
                                        ?.schedule.map((match, matchIndex) => {

                                            const getTeamName = (team: string | number | { round: string; group: string; team: number } | undefined) => {
                                                if (typeof team === 'object') {
                                                    return `${team.round} - ${team.group} - ${team.team}`;
                                                } else {
                                                    return `Team ${team}`;
                                                }
                                            };

                                            const teamAName =
                                                typeof match.teamA === 'object'
                                                    ? getTeamName(match.teamA)
                                                    : getTeamName(match.teamA.toString());

                                            const teamBName =
                                                typeof match.teamB === 'object'
                                                    ? getTeamName(match.teamB)
                                                    : getTeamName(match.teamB.toString());

                                            return {
                                                key: matchIndex,
                                                matchIndex: matchIndex + 1,
                                                group: match.group,
                                                teamA: teamAName,
                                                teamB: teamBName,
                                                action: (
                                                    <Button
                                                        type='default'
                                                        icon={<DeleteOutlined />}
                                                        style={{ color: 'red' }}
                                                        onClick={() => handleDeleteMatch(matchIndex)}
                                                    />
                                                ),
                                            };
                                        })}

                                    columns={columns}
                                />
                                <div className='flex items-center gap-4'>
                                    <Select
                                        placeholder='Select group'
                                        onChange={handleGroupForScheduleChange}
                                        value={selectedGroupForSchedule}
                                        className='w-full'
                                    >
                                        {data
                                            .find((round) => round.name === selectedRoundName)
                                            ?.groups.map((group) => (
                                                <Select.Option key={group.name} value={group.name}>
                                                    {group.name}
                                                </Select.Option>
                                            ))}
                                    </Select>
                                    <Select
                                        placeholder='Select Team A'
                                        onChange={handleTeamAChange}
                                        value={selectedTeamA ? (typeof selectedTeamA === 'object' ? `${selectedTeamA.round} - ${selectedTeamA.group} - ${selectedTeamA.team}` : selectedTeamA) : null}
                                        className='w-full'
                                    >
                                        {data
                                            .find((round) => round.name === selectedRoundName)
                                            ?.groups.find((group) => group.name === selectedGroupForSchedule)
                                            ?.teams.map((team, index) => (
                                                <Select.Option
                                                    key={index}
                                                    value={typeof team.team === 'object' ? JSON.stringify(team.team) : team.team}
                                                >
                                                    {typeof team.team === 'object'
                                                        ? `${team.team.round} - ${team.team.group} - ${team.team.team}`
                                                        : team.team}
                                                </Select.Option>
                                            ))}
                                    </Select>

                                    <Select
                                        placeholder='Select Team B'
                                        onChange={handleTeamBChange}
                                        value={selectedTeamB ? (typeof selectedTeamB === 'object' ? `${selectedTeamB.round} - ${selectedTeamB.group} - ${selectedTeamB.team}` : selectedTeamB) : null}
                                        className='w-full'
                                    >
                                        {data
                                            .find((round) => round.name === selectedRoundName)
                                            ?.groups.find((group) => group.name === selectedGroupForSchedule)
                                            ?.teams.map((team, index) => (
                                                <Select.Option
                                                    key={index}
                                                    value={typeof team.team === 'object' ? JSON.stringify(team.team) : team.team}
                                                >
                                                    {typeof team.team === 'object'
                                                        ? `${team.team.round} - ${team.team.group} - ${team.team.team}`
                                                        : team.team}
                                                </Select.Option>
                                            ))}
                                    </Select>

                                    <Button type='primary' onClick={handleAddMatch} className='w-full'>
                                        Add Match
                                    </Button>
                                </div>
                            </div>
                        )}
                    </TabPane>
                </Tabs>
            </div>

            <Modal
                title='Add New Round'
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input
                    placeholder='Enter round name'
                    value={newRoundName}
                    onChange={(e) => setNewRoundName(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default GameModeAdder;
