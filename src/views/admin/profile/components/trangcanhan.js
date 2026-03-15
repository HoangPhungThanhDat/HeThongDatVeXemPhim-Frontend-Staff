import React from "react";
import {
  Box,
  Grid,
  Text,
  Flex,
  Avatar,
  Button,
  Badge,
  Divider,
  SimpleGrid,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";

import {
  MdAdminPanelSettings,
  MdConfirmationNumber,
  MdMovie,
  MdPeople,
} from "react-icons/md";

export default function TrangCaNhan() {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const ticketBg = useColorModeValue("gray.50", "gray.600");

  const tickets = [
    {
      movie: "Avengers: Endgame",
      seat: "A5",
      time: "20:00 - 12/06/2026",
      status: "Đã thanh toán",
    },
    {
      movie: "Spider-Man: No Way Home",
      seat: "B2",
      time: "18:30 - 10/06/2026",
      status: "Đã thanh toán",
    },
  ];

  return (
    <Box pt={{ base: "120px", md: "80px" }} px="20px">
      <Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap="20px">

        {/* ADMIN PROFILE */}
        <Box bg={cardBg} p="25px" borderRadius="20px" boxShadow="md">

          <Flex direction="column" align="center">

            <Avatar
              size="2xl"
              src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/anh-avatar-ngau-2.jpg"
              mb="15px"
              border="4px solid orange"
            />

            <Text fontSize="2xl" fontWeight="700" color={textColor}>
              Lý Tiểu Long
            </Text>

            <Flex align="center" mb="10px">
              <Icon as={MdAdminPanelSettings} color="orange.400" mr="5px" />
              <Text color="gray.500">
                Quản trị viên hệ thống
              </Text>
            </Flex>

            <Badge colorScheme="orange" mb="15px">
              ADMIN
            </Badge>

            <Button colorScheme="orange" size="sm">
              Chỉnh sửa hồ sơ
            </Button>

          </Flex>

          <Divider my="20px" />

          {/* THÔNG TIN ADMIN */}
          <Text fontWeight="600" mb="10px">
            Thông tin quản trị
          </Text>

          <Text color="gray.500">
            Email: admin@cinema.com
          </Text>

          <Text color="gray.500">
            SĐT: 0900000000
          </Text>

          <Text color="gray.500">
            Vai trò: Quản lý hệ thống rạp phim
          </Text>

        </Box>

        {/* QUẢN LÝ HOẠT ĐỘNG */}
        <Box bg={cardBg} p="25px" borderRadius="20px" boxShadow="md">

          <Text fontSize="2xl" fontWeight="700" mb="20px" color={textColor}>
            Hoạt động quản lý
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">

            <Box
              p="20px"
              borderRadius="15px"
              bg={ticketBg}
              textAlign="center"
            >
              <Icon as={MdConfirmationNumber} boxSize="35px" color="orange.400" />

              <Text fontSize="2xl" fontWeight="700">
                124
              </Text>

              <Text color="gray.500">
                Vé đã bán hôm nay
              </Text>
            </Box>

            <Box
              p="20px"
              borderRadius="15px"
              bg={ticketBg}
              textAlign="center"
            >
              <Icon as={MdMovie} boxSize="35px" color="orange.400" />

              <Text fontSize="2xl" fontWeight="700">
                32
              </Text>

              <Text color="gray.500">
                Phim đang chiếu
              </Text>
            </Box>

            <Box
              p="20px"
              borderRadius="15px"
              bg={ticketBg}
              textAlign="center"
            >
              <Icon as={MdPeople} boxSize="35px" color="orange.400" />

              <Text fontSize="2xl" fontWeight="700">
                845
              </Text>

              <Text color="gray.500">
                Người dùng
              </Text>
            </Box>

            <Box
              p="20px"
              borderRadius="15px"
              bg={ticketBg}
              textAlign="center"
            >
              <Icon as={MdMovie} boxSize="35px" color="orange.400" />

              <Text fontSize="2xl" fontWeight="700">
                15
              </Text>

              <Text color="gray.500">
                Suất chiếu hôm nay
              </Text>
            </Box>

          </SimpleGrid>

        </Box>

      </Grid>

      {/* DANH SÁCH VÉ GẦN ĐÂY */}
      <Box
        bg={cardBg}
        p="25px"
        borderRadius="20px"
        boxShadow="md"
        mt="20px"
      >

        <Text fontSize="2xl" fontWeight="700" mb="20px" color={textColor}>
          Vé đặt gần đây
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">

          {tickets.map((ticket, index) => (
            <Box
              key={index}
              p="20px"
              borderRadius="15px"
              bg={ticketBg}
              transition="0.3s"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "lg",
              }}
            >

              <Flex justify="space-between" mb="10px">
                <Text fontWeight="700" color={textColor}>
                  {ticket.movie}
                </Text>

                <Badge colorScheme="green">
                  {ticket.status}
                </Badge>
              </Flex>

              <Flex align="center" mb="5px">
                <MdConfirmationNumber style={{ marginRight: 6 }} />

                <Text fontSize="sm">
                  Ghế: {ticket.seat}
                </Text>
              </Flex>

              <Text fontSize="sm" color="gray.500">
                {ticket.time}
              </Text>

            </Box>
          ))}

        </SimpleGrid>
      </Box>

    </Box>
  );
}