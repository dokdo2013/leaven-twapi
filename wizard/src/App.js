import {
  Container,
  InputGroup,
  Input,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  Button,
  Badge,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

function App() {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios.get("/eventsub").then((res) => {
      setData(res.data.data);
    });
  };

  const addData = () => {
    axios.post(`/eventsub/${input}`).then((res) => {
      getData();
    });
  };

  const deleteData = (id) => {
    axios.delete(`/eventsub/${id}`).then((res) => {
      getData();
    });
  };

  return (
    <Container maxW={1200} mt={4}>
      <InputGroup>
        <Input
          placeholder="추가할 ID를 입력해주세요"
          mr={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <Button
          colorScheme="blue"
          mr={1}
          onClick={() => {
            addData();
          }}
        >
          등록
        </Button>
        <Button colorScheme="teal" onClick={getData}>
          새로고침
        </Button>
      </InputGroup>
      <Table mt={4}>
        <Thead>
          <Tr>
            <Th>id</Th>
            <Th>user_id</Th>
            <Th>type</Th>
            <Th>created at</Th>
            <Th>status</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((item) => (
            <Tr key={item.id}>
              <Td>{item.id}</Td>
              <Td>{JSON.stringify(item.condition, null, 4)}</Td>
              <Td>{item.type}</Td>
              <Td minW={130}>
                {dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss")}
              </Td>
              <Td>
                {item.status.includes("enabled") ? (
                  <Badge colorScheme="green">{item.status}</Badge>
                ) : item.status.includes("failed") ? (
                  <Badge colorScheme="red">{item.status}</Badge>
                ) : item.status.includes("pending") ? (
                  <Badge colorScheme="blue">{item.status}</Badge>
                ) : (
                  <Badge colorScheme="gray">{item.status}</Badge>
                )}
              </Td>
              <Td>
                <Button colorScheme="red" onClick={() => deleteData(item.id)}>
                  삭제
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
}

export default App;
