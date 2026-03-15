import React, { useState } from "react";
import {
  Box,
  Grid,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Badge,
  SimpleGrid,
  Divider,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  TableContainer,
   GridItem,
} from "@chakra-ui/react";

import { MdAccessTime, MdAdd, MdEdit, MdVisibility } from "react-icons/md";
import Card from "components/card/Card";
import { FaFilm } from "react-icons/fa";
import { useColorModeValue } from "@chakra-ui/react";

export default function Quanlysuatchieu() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selected, setSelected] = useState(null);

  const [editing, setEditing] = useState(null);

  const [showtimes, setShowtimes] = useState([
    {
      id: 1,
      movie: "Avengers: Infinity War",
      room: "Phòng 1",
      date: "2026-01-20",
      time: "18:00",
      status: "Đang chiếu",
    },
    {
      id: 2,
      movie: "Spider-Man: No Way Home",
      room: "Phòng 2",
      date: "2026-01-20",
      time: "20:30",
      status: "Sắp chiếu",
    },
  ]);

  const openEdit = (showtime) => {
    setEditing(showtime);
    onOpen();
  };

  const handleUpdate = () => {
    setShowtimes(
      showtimes.map((s) => (s.id === editing.id ? editing : s))
    );
    onClose();
  };
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Box pt={{ base: "120px", md: "80px" }}>
      {/* HEADER */}

      <Flex
        justify="space-between"
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        mb="30px"
      >
        <Box>
          <Flex align="center" mb="6px">
            <Icon as={MdAccessTime} boxSize="22px" mr="8px" color="brand.500" />
            <Text fontSize="3xl" fontWeight="800">
              Quản lý suất chiếu
            </Text>
          </Flex>

          <Text color="gray.500">
            Quản lý lịch chiếu phim theo phòng và khung giờ
          </Text>
        </Box>

        <Button leftIcon={<MdAdd />} colorScheme="brand" size="sm" onClick={onOpen}>
          Thêm suất chiếu
        </Button>
      </Flex>

      <Grid templateColumns={{ xl: "3.4fr 1.4fr" }} gap="24px">
        {/* TABLE */}

        <Card p="20px">
          <Flex justify="space-between" mb="14px">
            <Text fontWeight="700">Danh sách suất chiếu</Text>

            <Badge colorScheme="purple">Tổng: {showtimes.length}</Badge>
          </Flex>

          <Divider mb="12px" />

          <TableContainer>
            <Table variant="simple">
              <Thead bg={useColorModeValue("gray.50", "gray.700")}>
                <Tr>
                  <Th>Phim</Th>
                  <Th>Phòng</Th>
                  <Th>Ngày</Th>
                  <Th>Giờ</Th>
                  <Th>Trạng thái</Th>
                  <Th textAlign="center">Hành động</Th>
                </Tr>
              </Thead>

              <Tbody>
  {showtimes.map((s) => (
    <Tr
      key={s.id}
      _hover={{ bg: hoverBg, cursor: "pointer" }}
      transition="0.2s"
    >
                    <Td fontWeight="600">{s.movie}</Td>

                    <Td>{s.room}</Td>

                    <Td>{s.date}</Td>

                    <Td>{s.time}</Td>

                    <Td>
                      <Badge
                        colorScheme={
                          s.status === "Đang chiếu"
                            ? "green"
                            : s.status === "Sắp chiếu"
                            ? "orange"
                            : "gray"
                        }
                      >
                        {s.status}
                      </Badge>
                    </Td>

                    <Td>
                      <Flex justify="center" gap="8px">
                        <Button
                          size="xs"
                          leftIcon={<MdVisibility />}
                          onClick={() => setSelected(s)}
                        >
                          Xem
                        </Button>

                        <Button
                          size="xs"
                          colorScheme="orange"
                          leftIcon={<MdEdit />}
                          onClick={() => openEdit(s)}
                        >
                          Sửa
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>

        {/* SIDEBAR */}

        <Box>
          <SimpleGrid spacing="18px">
            <Card p="18px">
              <Text fontSize="sm" color="gray.500">
                Tổng suất chiếu
              </Text>

              <Text fontSize="3xl" fontWeight="800">
                {showtimes.length}
              </Text>
            </Card>

            <Card p="18px">
              <Text fontSize="sm" color="gray.500">
                Đang chiếu
              </Text>

              <Text fontSize="2xl" fontWeight="700">
                {showtimes.filter((s) => s.status === "Đang chiếu").length}
              </Text>
            </Card>

            <Card p="18px">
              <Text fontSize="sm" color="gray.500">
                Sắp chiếu
              </Text>

              <Text fontSize="2xl" fontWeight="700">
                {showtimes.filter((s) => s.status === "Sắp chiếu").length}
              </Text>
            </Card>
          </SimpleGrid>

          {/* CHI TIẾT */}

          <Box mt="24px">
  <Card p="22px">
    <Flex align="center" justify="space-between" mb="10px">
      <Text fontWeight="700" fontSize="lg">
        Chi tiết suất chiếu
      </Text>

      {selected && (
        <Badge colorScheme="purple" px="10px" py="2px">
          Showtime
        </Badge>
      )}
    </Flex>

    <Divider mb="16px" />

    {!selected ? (
      <Flex
        direction="column"
        align="center"
        justify="center"
        py="30px"
        color="gray.400"
      >
        <Icon as={MdAccessTime} boxSize="36px" mb="8px" />
        <Text fontSize="sm">Chọn suất chiếu để xem chi tiết</Text>
      </Flex>
    ) : (
      <>
        {/* MOVIE */}

        <Box mb="16px">
          <Text fontSize="xs" color="gray.500" mb="2px">
            PHIM
          </Text>

          <Text fontWeight="700" fontSize="lg">
            {selected.movie}
          </Text>
        </Box>

        {/* ROOM */}

        <Box mb="12px">
          <Text fontSize="xs" color="gray.500">
            PHÒNG CHIẾU
          </Text>

          <Text fontWeight="600">{selected.room}</Text>
        </Box>

        {/* DATE */}

        <Box mb="12px">
          <Text fontSize="xs" color="gray.500">
            NGÀY CHIẾU
          </Text>

          <Text fontWeight="600">📅 {selected.date}</Text>
        </Box>

        {/* TIME */}

        <Box mb="12px">
          <Text fontSize="xs" color="gray.500">
            GIỜ BẮT ĐẦU
          </Text>

          <Text fontWeight="600">⏰ {selected.time}</Text>
        </Box>

        {/* STATUS */}

        <Box mb="18px">
          <Text fontSize="xs" color="gray.500">
            TRẠNG THÁI
          </Text>

          <Badge
            mt="4px"
            colorScheme={
              selected.status === "Đang chiếu"
                ? "green"
                : selected.status === "Sắp chiếu"
                ? "orange"
                : "gray"
            }
            px="10px"
            py="4px"
            borderRadius="6px"
          >
            {selected.status}
          </Badge>
        </Box>

        <Divider mb="14px" />

        {/* BUTTON */}

        <Button
          w="100%"
          size="sm"
          colorScheme="orange"
          leftIcon={<MdEdit />}
          onClick={() => openEdit(selected)}
        >
          Chỉnh sửa suất chiếu
        </Button>
      </>
    )}
  </Card>
</Box>
        </Box>
      </Grid>

      {/* MODAL EDIT */}

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
  <ModalOverlay backdropFilter="blur(6px)" />

  <ModalContent borderRadius="20px" shadow="2xl">

    <ModalHeader>
      <Box display="flex" alignItems="center" gap="10px">
        <Icon as={FaFilm} color="green.500" />
        <Text fontWeight="700">Chỉnh sửa suất chiếu</Text>
      </Box>
    </ModalHeader>

    <ModalCloseButton />

    {editing && (
      <>
        <ModalBody>

          <Divider mb="16px" />

          <Grid templateColumns="repeat(2, 1fr)" gap="16px">

            {/* Phim */}
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel fontWeight="600">Tên phim</FormLabel>

                <Input
                  placeholder="Nhập tên phim"
                  value={editing.movie}
                  focusBorderColor="green.400"
                  onChange={(e) =>
                    setEditing({ ...editing, movie: e.target.value })
                  }
                />
              </FormControl>
            </GridItem>

            {/* Phòng */}
            <FormControl>
              <FormLabel fontWeight="600">Phòng chiếu</FormLabel>

              <Input
                placeholder="Phòng A1"
                value={editing.room}
                focusBorderColor="green.400"
                onChange={(e) =>
                  setEditing({ ...editing, room: e.target.value })
                }
              />
            </FormControl>

            {/* Trạng thái */}
            <FormControl>
              <FormLabel fontWeight="600">Trạng thái</FormLabel>

              <Select
                focusBorderColor="green.400"
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value })
                }
              >
                <option>Đang chiếu</option>
                <option>Sắp chiếu</option>
                <option>Đã kết thúc</option>
              </Select>
            </FormControl>

            {/* Ngày */}
            <FormControl>
              <FormLabel fontWeight="600">Ngày chiếu</FormLabel>

              <Input
                type="date"
                focusBorderColor="green.400"
                value={editing.date}
                onChange={(e) =>
                  setEditing({ ...editing, date: e.target.value })
                }
              />
            </FormControl>

            {/* Giờ */}
            <FormControl>
              <FormLabel fontWeight="600">Giờ chiếu</FormLabel>

              <Input
                type="time"
                focusBorderColor="green.400"
                value={editing.time}
                onChange={(e) =>
                  setEditing({ ...editing, time: e.target.value })
                }
              />
            </FormControl>

          </Grid>
        </ModalBody>

        <ModalFooter mt="10px">

          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
          >
            Hủy
          </Button>

          <Button
            colorScheme="green"
            px="28px"
            fontWeight="600"
            onClick={handleUpdate}
          >
            Lưu thay đổi
          </Button>

        </ModalFooter>
      </>
    )}
  </ModalContent>
</Modal>
    </Box>
  );
}