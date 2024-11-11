import React, { useState, useEffect } from "react";
import {
    Container,
    Title,
    Paper,
    Space,
    Button,
    Grid,
    NumberInput,
    Text,
    Table,
    Divider,
    Loader,
    Grid as MantineGrid,
} from "@mantine/core";
import { Graph } from "react-d3-graph";
import axios from "axios";

export const HomePage = () => {
    const [size, setSize] = useState(2);
    const [adjMatrix, setAdjMatrix] = useState(
        Array(2)
            .fill(null)
            .map(() => Array(2).fill(0))
    );
    const [mstResult, setMstResult] = useState(null);
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [mstGraphData, setMstGraphData] = useState({ nodes: [], links: [] });
    const [loading, setLoading] = useState(false);

    const addVertex = () => {
        setSize(size + 1);
        setAdjMatrix((prevMatrix) => {
            const newMatrix = prevMatrix.map((row) => [...row]);
            newMatrix.forEach((row) => row.push(0));
            newMatrix.push(Array(size + 1).fill(0));
            return newMatrix;
        });
    };

    const updateMatrix = (row, col, value) => {
        setAdjMatrix((prevMatrix) => {
            const newMatrix = prevMatrix.map((row) => [...row]);
            newMatrix[row][col] = value;
            return newMatrix;
        });
    };

    const calculateMST = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                "http://0.0.0.0:8000/minimum_spanning_tree/",
                { graph: adjMatrix }
            );
            setMstResult(response.data);

            const mstEdges = response.data.edges.map((edge) => ({
                source: edge[0],
                target: edge[1],
                label: edge[2].toString(),
                color: "red",
            }));

            const mstNodes = mstEdges.reduce((acc, edge) => {
                acc.add(edge.source);
                acc.add(edge.target);
                return acc;
            }, new Set());

            const mstNodesArray = Array.from(mstNodes).map((id) => ({
                id,
                x: 0,
                y: 0,
            }));

            setMstGraphData({
                nodes: mstNodesArray,
                links: mstEdges,
            });
        } catch (error) {
            console.error("Ошибка при вычислении MST:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const fillExampleMatrix = () => {
        const exampleGraph = [
            [0, 2, 6, 8, 0, 0, 3, 0, 0],
            [2, 0, 9, 3, 0, 4, 9, 0, 0],
            [6, 9, 0, 7, 0, 0, 0, 0, 0],
            [8, 3, 7, 0, 5, 5, 0, 0, 0],
            [0, 0, 0, 5, 0, 0, 8, 9, 0],
            [0, 4, 0, 5, 0, 0, 0, 6, 4],
            [3, 9, 0, 0, 8, 0, 0, 0, 0],
            [0, 0, 0, 0, 9, 6, 0, 0, 1],
            [0, 0, 0, 0, 0, 4, 0, 1, 0],
        ];
        setSize(exampleGraph.length);
        setAdjMatrix(exampleGraph);
    };

    const buildGraphData = () => {
        const nodes = [];
        const links = [];
        const radius = 200;
        const centerX = 450;
        const centerY = 250;

        for (let i = 0; i < adjMatrix.length; i++) {
            const angle = (2 * Math.PI * i) / adjMatrix.length;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            nodes.push({ id: i, x, y });
        }

        for (let i = 0; i < adjMatrix.length; i++) {
            for (let j = i + 1; j < adjMatrix[i].length; j++) {
                if (adjMatrix[i][j] > 0) {
                    links.push({
                        source: i,
                        target: j,
                        label: adjMatrix[i][j].toString(),
                    });
                }
            }
        }

        setGraphData({ nodes, links });
    };

    useEffect(() => {
        buildGraphData();
    }, [adjMatrix]);

    const graphConfig = {
        nodeHighlightBehavior: true,
        node: {
            color: "#1d3557",
            size: 400,
            highlightStrokeColor: "#FF4F58",
            labelProperty: "id",
            fontSize: 16,
            fontColor: "#F1F1F1",
            labelPosition: "center",
        },
        link: {
            color: "#7F8C8D",
            highlightColor: "#FF4F58",
            renderLabel: true,
            fontSize: 14,
            fontColor: "#F1F1F1",
        },
        d3: {
            linkLength: 120,
            gravity: -300,
        },
        height: 500,
        width: 800,
    };

    const mstGraphConfig = {
        ...graphConfig,
        link: {
            ...graphConfig.link,
            renderLabel: false,
            color: "red",
        },
    };

    return (
        <Container style={{ textAlign: "center", padding: "2rem" }}>
            <Paper shadow="xl" radius="xl" p={"md"} bg={"#262626"}>
                <Title order={1} style={{ color: "#ecf0f1" }}>
                    Минимальное остовное дерево
                </Title>
                <Space h="md" />
                <Button
                    variant="default"
                    onClick={addVertex}
                    radius="md"
                    mr="20px"
                    mb="20px"
                    size="lg"
                >
                    Добавить вершину
                </Button>
                <Button
                    variant="default"
                    onClick={fillExampleMatrix}
                    radius="md"
                    mb="20px"
                    size="lg"
                >
                    Пример
                </Button>
                <Grid>
                    {adjMatrix.map((row, rowIndex) => (
                        <Grid.Col key={rowIndex} span={12}>
                            <Grid justify="center">
                                {row.map((value, colIndex) => (
                                    <Grid.Col key={colIndex} span={1}>
                                        <NumberInput
                                            size="sm"
                                            variant="filled"
                                            min={0}
                                            radius="md"
                                            value={value}
                                            onChange={(val) =>
                                                updateMatrix(
                                                    rowIndex,
                                                    colIndex,
                                                    val || 0
                                                )
                                            }
                                            style={{
                                                width: "60px",
                                            }}
                                        />
                                    </Grid.Col>
                                ))}
                            </Grid>
                        </Grid.Col>
                    ))}
                </Grid>
                <Button
                    radius="md"
                    mt="20px"
                    onClick={calculateMST}
                    size="lg"
                    disabled={loading}
                >
                    Рассчитать минимальное остовное дерево
                    {loading && <Loader size="sm" color="#fff" />}
                </Button>
                {mstResult && (
                    <Paper mt="20px" p="md">
                        <Text size="lg" style={{ color: "#ecf0f1" }}>
                            Вес минимального остовного дерева:{" "}
                            <strong>{mstResult.weight}</strong>
                        </Text>

                        <Table
                            mt="10px"
                            highlightOnHover
                            striped
                            withColumnBorders
                            withTableBorder
                        >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Откуда</Table.Th>
                                    <Table.Th>Куда</Table.Th>
                                    <Table.Th>Вес</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {mstResult.edges.map((edge, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td>{edge[0]}</Table.Td>
                                        <Table.Td>{edge[1]}</Table.Td>
                                        <Table.Td>{edge[2]}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                        <Divider my="md" />
                        <Text size="md">
                            Текстовое решение:
                            <pre
                                style={{
                                    marginTop: "10px",
                                    whiteSpace: "pre-wrap",
                                    wordWrap: "break-word",
                                }}
                            >
                                {mstResult.text}
                            </pre>
                        </Text>
                    </Paper>
                )}
                <Space h="md" />
                <Paper shadow="xs" p="md">
                    <Title order={3} style={{ color: "#ecf0f1" }}>
                        Исходная визуализация графа
                    </Title>
                    <Graph
                        id="graph-id"
                        data={graphData}
                        config={graphConfig}
                    />
                </Paper>
                <Paper shadow="xs" p="md">
                    <Title order={3} style={{ color: "#ecf0f1" }}>
                        Визуализация минимального остовного дерева
                    </Title>
                    <Graph
                        id="mst-graph-id"
                        data={mstGraphData}
                        config={mstGraphConfig}
                    />
                </Paper>
            </Paper>
        </Container>
    );
};
