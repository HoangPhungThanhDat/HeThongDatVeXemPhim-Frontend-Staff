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
  SimpleGrid,
  Badge,
  Flex,
  TableContainer,
  Divider,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";

import Card from "components/card/Card";

export default function Hotrokhachhang() {
  const [view, setView] = useState("list");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // DARK MODE COLORS
  const tableBg = useColorModeValue("gray.50", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const subText = useColorModeValue("gray.500", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // DATA MẪU
  const ticket = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    subject: "Không đặt được vé",
    message: "Tôi không thể thanh toán khi đặt vé xem phim.",
    status: "Đang xử lý",
    date: "20/01/2026",
  };

  /* ======================
      VIEW LIST
  ====================== */
  if (view === "list") {
    return (
      <Box pt={{ base: "130px", md: "80px" }}>
        {/* HEADER */}
        <Flex justify="space-between" align="center" mb="25px">
          <Box>
            <Text fontSize="2xl" fontWeight="700" color={textColor}>
              Hỗ trợ khách hàng
            </Text>
            <Text color={subText}>
              Quản lý yêu cầu và phản hồi của khách hàng
            </Text>
          </Box>

          <Button colorScheme="brand" size="sm" isDisabled>
            + Tạo yêu cầu
          </Button>
        </Flex>

        <Grid templateColumns={{ xl: "3.2fr 1.2fr" }} gap="20px">
          {/* BẢNG */}
          <Card>
            <Text fontWeight="600" mb="12px" color={textColor}>
              Danh sách yêu cầu
            </Text>

            <Divider mb="10px" borderColor={borderColor} />

            <TableContainer overflowX="auto">
              <Table variant="simple" size="sm" minW="700px">
                <Thead bg={tableBg}>
                  <Tr>
                    <Th>Khách hàng</Th>
                    <Th>Email</Th>
                    <Th>Chủ đề</Th>
                    <Th>Trạng thái</Th>
                    <Th>Ngày</Th>
                    <Th textAlign="right">Hành động</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  <Tr _hover={{ bg: hoverBg }}>
                    <Td color={textColor}>{ticket.name}</Td>
                    <Td color={textColor}>{ticket.email}</Td>
                    <Td color={textColor}>{ticket.subject}</Td>

                    <Td>
                      <Badge colorScheme="orange">
                        {ticket.status}
                      </Badge>
                    </Td>

                    <Td color={textColor}>{ticket.date}</Td>

                    <Td>
                      <Flex justify="flex-end" gap="10px">
                        <Button
                          size="xs"
                          colorScheme="blue"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setView("detail");
                          }}
                        >
                          Chi tiết
                        </Button>

                        <Button
                          size="xs"
                          colorScheme="green"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setView("edit");
                          }}
                        >
                          Xử lý
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Card>

          {/* CỘT PHẢI */}
          <Box>
            <SimpleGrid columns={1} spacing="16px">
              <Card>
                <Text fontSize="sm" color={subText}>
                  Tổng yêu cầu
                </Text>
                <Text fontSize="3xl" fontWeight="700" color={textColor}>
                  1
                </Text>
              </Card>

              <Card>
                <Text fontSize="sm" color={subText}>
                  Đang xử lý
                </Text>

                <Flex align="center" mt="5px">
                  <Badge colorScheme="orange" mr="8px">
                    Processing
                  </Badge>
                  <Text fontSize="2xl" fontWeight="700" color={textColor}>
                    1
                  </Text>
                </Flex>
              </Card>

              <Card>
                <Text fontSize="sm" color={subText}>
                  Đã hoàn thành
                </Text>

                <Flex align="center" mt="5px">
                  <Badge colorScheme="green" mr="8px">
                    Done
                  </Badge>
                  <Text fontSize="2xl" fontWeight="700" color={textColor}>
                    0
                  </Text>
                </Flex>
              </Card>
            </SimpleGrid>
          </Box>
        </Grid>
      </Box>
    );
  }

  /* ======================
      VIEW DETAIL
  ====================== */

  if (view === "detail" && selectedTicket) {
    return (
      <Box pt={{ base: "130px", md: "80px" }}>
        <Button mb="20px" onClick={() => setView("list")}>
          ← Quay lại danh sách
        </Button>

        <Card p="25px">
          <Text fontSize="2xl" fontWeight="700" mb="20px" color={textColor}>
            Chi tiết yêu cầu
          </Text>

          <Text mb="5px" color={textColor}>
            <b>Khách hàng:</b> {selectedTicket.name}
          </Text>

          <Text mb="5px" color={textColor}>
            <b>Email:</b> {selectedTicket.email}
          </Text>

          <Text mb="5px" color={textColor}>
            <b>Chủ đề:</b> {selectedTicket.subject}
          </Text>

          <Text mb="5px" color={textColor}>
            <b>Ngày gửi:</b> {selectedTicket.date}
          </Text>

          <Divider my="15px" borderColor={borderColor} />

          <Text fontWeight="600" color={textColor}>
            Nội dung yêu cầu
          </Text>

          <Text mt="6px" color={subText}>
            {selectedTicket.message}
          </Text>

          <Button
            mt="20px"
            colorScheme="green"
            onClick={() => setView("edit")}
          >
            Xử lý yêu cầu
          </Button>
        </Card>
      </Box>
    );
  }

  /* ======================
      VIEW EDIT
  ====================== */

  if (view === "edit" && selectedTicket) {
    return (
      <Box pt={{ base: "130px", md: "80px" }}>
        <Button mb="20px" onClick={() => setView("detail")}>
          ← Quay lại chi tiết
        </Button>

        <Text fontSize="2xl" fontWeight="800" mb="20px" color={textColor}>
          Xử lý yêu cầu khách hàng
        </Text>

        <Grid templateColumns={{ base: "1fr", md: "1.2fr 1fr" }} gap="24px">

          {/* LEFT */}
          <Card p="20px">
            <Text fontWeight="700" mb="15px" color={textColor}>
              Thông tin yêu cầu
            </Text>

            <Divider mb="15px" borderColor={borderColor} />

            <Text color={subText}>Khách hàng</Text>
            <Text fontWeight="600" mb="10px" color={textColor}>
              {selectedTicket.name}
            </Text>

            <Text color={subText}>Email</Text>
            <Text fontWeight="600" mb="10px" color={textColor}>
              {selectedTicket.email}
            </Text>

            <Text color={subText}>Chủ đề</Text>
            <Text fontWeight="600" mb="10px" color={textColor}>
              {selectedTicket.subject}
            </Text>

            <Text color={subText}>Ngày gửi</Text>
            <Text fontWeight="600" mb="10px" color={textColor}>
              {selectedTicket.date}
            </Text>

            <Badge colorScheme="orange">
              {selectedTicket.status}
            </Badge>

            <Divider my="15px" borderColor={borderColor} />

            <Text fontWeight="600" mb="8px" color={textColor}>
              Nội dung khách hàng
            </Text>

            <Box
              bg={tableBg}
              p="15px"
              borderRadius="10px"
              border="1px solid"
              borderColor={borderColor}
            >
              <Text color={textColor}>
                {selectedTicket.message}
              </Text>
            </Box>
          </Card>

          {/* RIGHT */}
          <Card p="20px">
            <Text fontWeight="700" mb="15px" color={textColor}>
              Phản hồi khách hàng
            </Text>

            <Divider mb="15px" borderColor={borderColor} />

            <Text mb="8px" fontSize="sm" color={subText}>
              Nội dung phản hồi
            </Text>

            <Textarea
              placeholder="Nhập nội dung phản hồi cho khách hàng..."
              height="150px"
              resize="none"
              borderRadius="10px"
            />

            <Divider my="20px" borderColor={borderColor} />

            <Flex justify="space-between">
              <Button variant="outline" onClick={() => setView("detail")}>
                Hủy
              </Button>

              <Button colorScheme="green">
                ✓ Đánh dấu đã xử lý
              </Button>
            </Flex>
          </Card>
        </Grid>
      </Box>
    );
  }

  return null;
}