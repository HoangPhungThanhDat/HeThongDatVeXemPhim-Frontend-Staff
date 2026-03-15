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
  TableContainer,
  Input,
  Select,
  FormControl,
  FormLabel,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  MdConfirmationNumber,
  MdEdit,
  MdArrowBack,
  MdVisibility,
  MdEventSeat,
} from "react-icons/md";

import Card from "components/card/Card";

export default function Quanlyve() {
  const headerBg = useColorModeValue("gray.100", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.600");

  const textColor = useColorModeValue("gray.800", "white");
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const inputBg = useColorModeValue("white", "gray.700");

  const [view, setView] = useState("list");
  const [selectedTicket, setSelectedTicket] = useState(null);

  /* GHẾ ĐANG CHỌN */
  const [selectedSeat, setSelectedSeat] = useState("");

  /* GHẾ HARD CODE */
  const seats = [
    { id: "A1", booked: false },
    { id: "A2", booked: true },
    { id: "A3", booked: false },
    { id: "A4", booked: false },
    { id: "A5", booked: true },

    { id: "B1", booked: false },
    { id: "B2", booked: false },
    { id: "B3", booked: true },
    { id: "B4", booked: false },
    { id: "B5", booked: false },

    { id: "C1", booked: false },
    { id: "C2", booked: true },
    { id: "C3", booked: false },
    { id: "C4", booked: false },
    { id: "C5", booked: false },
  ];

  const [tickets] = useState([
    {
      id: 1,
      code: "VE001",
      movie: "Avengers: Infinity War",
      showtime: "18:00 - Phòng 1",
      seat: "A5",
      price: "80.000đ",
      status: "Đã thanh toán",
      customer: "Nguyễn Văn A",
      email: "vana@gmail.com",
    },
    {
      id: 2,
      code: "VE002",
      movie: "Spider-Man: No Way Home",
      showtime: "20:30 - Phòng 2",
      seat: "B3",
      price: "90.000đ",
      status: "Đã hủy",
      customer: "Trần Văn B",
      email: "tranb@gmail.com",
    },
  ]);

  /* ======================
        VIEW CHI TIẾT
  ====================== */

  if (view === "detail" && selectedTicket) {
    return (
      <Box pt={{ base: "120px", md: "80px" }}>
        <Button
          leftIcon={<MdArrowBack />}
          mb="20px"
          onClick={() => setView("list")}
        >
          Quay lại
        </Button>

        <Grid templateColumns={{ xl: "2fr 1fr" }} gap="20px">
          <Card p="25px">
            <Text fontSize="2xl" fontWeight="700" mb="20px">
              Chi tiết vé
            </Text>

            <Divider mb="20px" />

            <SimpleGrid columns={2} spacing="20px">
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Mã vé
                </Text>
                <Text fontWeight="600">{selectedTicket.code}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Khách hàng
                </Text>
                <Text fontWeight="600">{selectedTicket.customer}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Email
                </Text>
                <Text>{selectedTicket.email}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Phim
                </Text>
                <Text>{selectedTicket.movie}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Suất chiếu
                </Text>
                <Text>{selectedTicket.showtime}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Ghế
                </Text>
                <Text>{selectedTicket.seat}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Giá vé
                </Text>
                <Text fontWeight="600">{selectedTicket.price}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Trạng thái
                </Text>

                <Badge
                  colorScheme={
                    selectedTicket.status === "Đã thanh toán"
                      ? "green"
                      : "red"
                  }
                >
                  {selectedTicket.status}
                </Badge>
              </Box>
            </SimpleGrid>

            <Flex justify="flex-end" mt="25px">
              <Button
                leftIcon={<MdEdit />}
                colorScheme="orange"
                onClick={() => {
                  setSelectedSeat(selectedTicket.seat);
                  setView("edit");
                }}
              >
                Chỉnh sửa vé
              </Button>
            </Flex>
          </Card>
        </Grid>
      </Box>
    );
  }

  /* ======================
        VIEW CHỈNH SỬA
  ====================== */

  if (view === "edit" && selectedTicket) {
    return (
      <Box pt={{ base: "120px", md: "80px" }}>
        <Button
          leftIcon={<MdArrowBack />}
          mb="20px"
          onClick={() => setView("detail")}
        >
          Quay lại chi tiết
        </Button>

        <Grid templateColumns={{ xl: "1.6fr 1fr" }} gap="20px">
          {/* FORM BÊN TRÁI */}

          <Card p="25px">
            <Text fontSize="2xl" fontWeight="700" mb="20px" color={textColor}>
              Chỉnh sửa vé
            </Text>

            <Divider mb="20px" />

            <SimpleGrid columns={2} spacing="20px">
              <FormControl>
                <FormLabel color={labelColor}>Mã vé</FormLabel>
                <Input bg={inputBg} defaultValue={selectedTicket.code} />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Khách hàng</FormLabel>
                <Input bg={inputBg} defaultValue={selectedTicket.customer} />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Email</FormLabel>
                <Input bg={inputBg} defaultValue={selectedTicket.email} />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Phim</FormLabel>
                <Input bg={inputBg} defaultValue={selectedTicket.movie} />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Suất chiếu</FormLabel>
                <Input bg={inputBg} defaultValue={selectedTicket.showtime} />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Ghế</FormLabel>
                <Input value={selectedSeat} readOnly bg={inputBg} />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Giá vé</FormLabel>
                <Input bg={inputBg} defaultValue={selectedTicket.price} />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Trạng thái</FormLabel>
                <Select bg={inputBg} defaultValue={selectedTicket.status}>
                  <option>Đã thanh toán</option>
                  <option>Đã hủy</option>
                </Select>
              </FormControl>
            </SimpleGrid>

            <Flex justify="flex-end" mt="25px" gap="10px">
              <Button variant="outline" onClick={() => setView("detail")}>
                Hủy
              </Button>

              <Button colorScheme="green">Lưu thay đổi</Button>
            </Flex>
          </Card>

          {/* SƠ ĐỒ GHẾ */}

          <Card p="25px">
  <Text fontSize="xl" fontWeight="700" mb="15px">
    Chọn ghế
  </Text>

  <Divider mb="20px" />

  {/* Màn hình rạp */}
  <Box
    bg="orange.400"
    color="white"
    textAlign="center"
    py="6px"
    borderRadius="md"
    mb="18px"
    fontSize="sm"
    fontWeight="600"
    letterSpacing="1px"
  >
    MÀN HÌNH
  </Box>

  <SimpleGrid columns={5} spacing="12px">
    {seats.map((seat) => (
      <Button
        key={seat.id}
        size="md"
        borderRadius="10px"
        leftIcon={<MdEventSeat />}
        bg={
          seat.booked
            ? "gray.400"
            : selectedSeat === seat.id
            ? "orange.500"
            : "orange.100"
        }
        color={seat.booked ? "white" : "orange.800"}
        _hover={
          !seat.booked && {
            bg: "orange.300",
            transform: "scale(1.05)",
          }
        }
        _active={{
          transform: "scale(0.95)",
        }}
        opacity={seat.booked ? 0.6 : 1}
        cursor={seat.booked ? "not-allowed" : "pointer"}
        transition="0.2s"
        onClick={() => {
          if (!seat.booked) {
            setSelectedSeat(seat.id);
          }
        }}
      >
        {seat.id}
      </Button>
    ))}
  </SimpleGrid>

  {/* Chú thích */}
  <Flex mt="20px" justify="space-between" fontSize="sm">
    <Flex align="center" gap="6px">
      <Box w="14px" h="14px" bg="orange.100" borderRadius="4px" />
      Ghế trống
    </Flex>

    <Flex align="center" gap="6px">
      <Box w="14px" h="14px" bg="orange.500" borderRadius="4px" />
      Ghế đang chọn
    </Flex>

    <Flex align="center" gap="6px">
      <Box w="14px" h="14px" bg="gray.400" borderRadius="4px" />
      Đã đặt
    </Flex>
  </Flex>
</Card>
        </Grid>
      </Box>
    );
  }

  /* ======================
        VIEW DANH SÁCH
  ====================== */

  return (
    <Box pt={{ base: "120px", md: "80px" }}>
      <Flex justify="space-between" mb="25px">
        <Box>
          <Flex align="center">
            <Icon
              as={MdConfirmationNumber}
              boxSize="22px"
              mr="8px"
              color="brand.500"
            />

            <Text fontSize="3xl" fontWeight="700">
              Quản lý vé
            </Text>
          </Flex>

          <Text color="gray.500">
            Quản lý vé đã bán theo suất chiếu và khách hàng
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ xl: "3.2fr 1.2fr" }} gap="20px">
        <Card>
          <Text fontWeight="600" mb="12px">
            Danh sách vé
          </Text>

          <Divider mb="10px" />

          <TableContainer>
            <Table variant="simple">
              <Thead bg={headerBg}>
                <Tr>
                  <Th>Mã vé</Th>
                  <Th>Phim</Th>
                  <Th>Suất chiếu</Th>
                  <Th>Ghế</Th>
                  <Th>Giá</Th>
                  <Th>Trạng thái</Th>
                  <Th>Hoạt động</Th>
                </Tr>
              </Thead>

              <Tbody>
                {tickets.map((t) => (
                  <Tr key={t.id} _hover={{ bg: hoverBg }}>
                    <Td>{t.code}</Td>
                    <Td>{t.movie}</Td>
                    <Td>{t.showtime}</Td>
                    <Td>{t.seat}</Td>
                    <Td>{t.price}</Td>

                    <Td>
                      <Badge
                        colorScheme={
                          t.status === "Đã thanh toán" ? "green" : "red"
                        }
                      >
                        {t.status}
                      </Badge>
                    </Td>

                    <Td>
                      <Flex gap="8px">
                        <Button
                          size="sm"
                          leftIcon={<MdVisibility />}
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => {
                            setSelectedTicket(t);
                            setView("detail");
                          }}
                        >
                          Xem
                        </Button>

                        <Button
                          size="sm"
                          leftIcon={<MdEdit />}
                          colorScheme="orange"
                          variant="outline"
                          onClick={() => {
                            setSelectedTicket(t);
                            setSelectedSeat(t.seat);
                            setView("edit");
                          }}
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

        <Box>
          <SimpleGrid columns={1} spacing="16px">
            <Card p="18px">
              <Text fontSize="sm" color="gray.500">
                Tổng vé
              </Text>

              <Text fontSize="3xl" fontWeight="700">
                {tickets.length}
              </Text>
            </Card>

            <Card p="18px">
              <Text fontSize="sm" color="gray.500">
                Đã thanh toán
              </Text>

              <Text fontSize="2xl" fontWeight="700">
                {tickets.filter((t) => t.status === "Đã thanh toán").length}
              </Text>
            </Card>

            <Card p="18px">
              <Text fontSize="sm" color="gray.500">
                Đã hủy
              </Text>

              <Text fontSize="2xl" fontWeight="700">
                {tickets.filter((t) => t.status === "Đã hủy").length}
              </Text>
            </Card>
          </SimpleGrid>
        </Box>
      </Grid>
    </Box>
  );
}