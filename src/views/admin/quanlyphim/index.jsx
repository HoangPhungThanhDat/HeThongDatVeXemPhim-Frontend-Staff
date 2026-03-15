import React, { useState } from "react";
import {
  Box, Grid,Text,Table,Thead,Tbody,Tr,Th,Td,Button,Flex,Badge,SimpleGrid,Divider,FormControl,FormLabel,Input,Select,Textarea,  useColorModeValue,
} from "@chakra-ui/react";

import { MdAdd, MdVisibility, MdEdit, MdArrowBack } from "react-icons/md";
import Card from "components/card/Card";

export default function Quanlyphim() {
  const [view, setView] = useState("list"); // list | detail | edit
  // COLOR MODE
  const [selectedMovie, setSelectedMovie] = useState(null);
const tableBg = useColorModeValue("gray.100", "gray.700");
// const rowBg = useColorModeValue("green.50", "gray.700");
const hoverBg = useColorModeValue("green.100", "gray.600");
const textGray = useColorModeValue("gray.500", "gray.300");
const descColor = useColorModeValue("gray.700", "gray.200");

  // DATA CỨNG
  const movie = {
    title: "Avengers: Infinity War",
    genre: "Hành động",
    duration: 120,
    releaseDate: "20/01/2026",
    status: "Đang chiếu",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg",
    description: "Cuộc chiến sinh tử giữa Avengers và Thanos.",
  };

  /* =======================
      VIEW LIST (LAYOUT CŨ – ĐÚNG Ý)
======================= */
if (view === "list") {
  return (
    <Box pt={{ base: "120px", md: "80px" }}>
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb="24px">
        <Box>
          <Text fontSize="2xl" fontWeight="800">
            Quản lý phim
          </Text>
          <Text color={textGray}>
            Quản lý danh sách phim và trạng thái chiếu
          </Text>
        </Box>

        <Button
          leftIcon={<MdAdd />}
          colorScheme="brand"
          size="md"
          px="22px"
        >
          Thêm phim
        </Button>
      </Flex>

      {/* MAIN GRID */}
      <Grid templateColumns={{ base: "1fr", xl: "3.5fr 1.2fr" }} gap="24px">
        {/* ===== LEFT: TABLE ===== */}
        <Card p="20px">
          <Flex justify="space-between" align="center" mb="14px">
            <Text fontSize="lg" fontWeight="700">
              🎬 Danh sách phim
            </Text>

            <Badge
              colorScheme="purple"
              px="12px"
              py="4px"
              borderRadius="full"
            >
              Tổng: 1 phim
            </Badge>
          </Flex>

          <Divider mb="16px" />

          <Table variant="simple" width="100%">
            <Thead bg={tableBg}>
              <Tr>
                <Th>Tên phim</Th>
                <Th>Thể loại</Th>
                <Th>Thời lượng</Th>
                <Th>Trạng thái</Th>
                <Th>Khởi chiếu</Th>
                <Th textAlign="center">Hành động</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr
  _hover={{ bg: hoverBg }}
  transition="0.2s"
>
                <Td fontWeight="700">
                  {movie.title}
                </Td>
                <Td>{movie.genre}</Td>
                <Td>{movie.duration} phút</Td>
                <Td>
                  <Badge
                    colorScheme="green"
                    px="10px"
                    py="4px"
                    borderRadius="full"
                  >
                    Đang chiếu
                  </Badge>
                </Td>
                <Td>{movie.releaseDate}</Td>
                <Td>
                  <Flex justify="center" gap="10px">
                    <Button
                      size="sm"
                      colorScheme="blue"
                      leftIcon={<MdVisibility />}
                      onClick={() => {
                        setSelectedMovie(movie);
                        setView("detail");
                      }}
                    >
                      Chi tiết
                    </Button>

                    <Button
                      size="sm"
                      colorScheme="orange"
                      leftIcon={<MdEdit />}
                      onClick={() => {
                        setSelectedMovie(movie);
                        setView("edit");
                      }}
                    >
                      Sửa
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Card>

        {/* ===== RIGHT: STATS ===== */}
        <SimpleGrid columns={1} spacing="16px">
          <Card p="18px">
            <Text fontSize="sm" color={textGray}>
              Tổng phim
            </Text>
            <Text fontSize="3xl" fontWeight="800">
              1
            </Text>
          </Card>

          <Card p="18px">
            <Text fontSize="sm" color={textGray}>
              Đang chiếu
            </Text>
            <Flex align="center" mt="8px">
              <Badge colorScheme="green" mr="10px">
                Showing
              </Badge>
              <Text fontSize="2xl" fontWeight="800">
                1
              </Text>
            </Flex>
          </Card>
        </SimpleGrid>
      </Grid>
    </Box>
  );
}

 /* =======================
      VIEW DETAIL (PRO)
======================= */
if (view === "detail" && selectedMovie) {
  return (
    <Box pt={{ base: "120px", md: "80px" }}>
      {/* BACK */}
      <Button
        leftIcon={<MdArrowBack />}
        mb="20px"
        variant="ghost"
        onClick={() => setView("list")}
      >
        Quay lại danh sách
      </Button>

      {/* HEADER CARD */}
      <Card p="0" overflow="hidden" mb="24px">
        <Flex>
          {/* POSTER */}
          <Box w={{ base: "100%", md: "35%" }}>
            <img
              src={selectedMovie.poster}
              alt="poster"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>

          {/* MAIN INFO */}
          <Box p="30px" w={{ base: "100%", md: "65%" }}>
            <Flex justify="space-between" align="start">
              <Box>
                <Text fontSize="2xl" fontWeight="800">
                  {selectedMovie.title}
                </Text>

                <Flex gap="10px" mt="8px">
                  <Badge colorScheme="green" fontSize="sm">
                    {selectedMovie.status}
                  </Badge>
                  <Badge colorScheme="purple" fontSize="sm">
                    {selectedMovie.genre}
                  </Badge>
                </Flex>
              </Box>

              <Button
                leftIcon={<MdEdit />}
                colorScheme="orange"
                size="sm"
                onClick={() => setView("edit")}
              >
                Chỉnh sửa
              </Button>
            </Flex>

            <Divider my="16px" />

            {/* QUICK INFO */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing="16px">
              <Box>
                <Text fontSize="xs" color="gray.500">
                  Thời lượng
                </Text>
                <Text fontWeight="700">
                  ⏱ {selectedMovie.duration} phút
                </Text>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500">
                  Ngày khởi chiếu
                </Text>
                <Text fontWeight="700">
                  📅 {selectedMovie.releaseDate}
                </Text>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500">
                  Định dạng
                </Text>
                <Text fontWeight="700">2D / IMAX</Text>
              </Box>
            </SimpleGrid>

            <Divider my="16px" />

            {/* DESCRIPTION */}
            <Box>
              <Text fontSize="sm" color="gray.500" mb="6px">
                Nội dung phim
              </Text>
              <Text lineHeight="1.8" color={descColor}>
                {selectedMovie.description}
              </Text>
            </Box>
          </Box>
        </Flex>
      </Card>

      {/* EXTRA INFO */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="24px">
        <Card p="20px">
          <Text fontSize="sm" color={textGray}>
            Đạo diễn
          </Text>
          <Text fontWeight="700">Anthony & Joe Russo</Text>
        </Card>

        <Card p="20px">
          <Text fontSize="sm" color={textGray}>
            Diễn viên
          </Text>
          <Text fontWeight="700">
            Robert Downey Jr, Chris Evans, Scarlett Johansson
          </Text>
        </Card>

        <Card p="20px">
          <Text fontSize="sm" color={textGray}>
            Quốc gia
          </Text>
          <Text fontWeight="700">Mỹ</Text>
        </Card>
      </SimpleGrid>

      {/* ACTION */}
      <Flex justify="flex-end" mt="30px">
        <Button
          leftIcon={<MdEdit />}
          colorScheme="orange"
          size="md"
          onClick={() => setView("edit")}
        >
          Chỉnh sửa phim
        </Button>
      </Flex>
    </Box>
  );
}

  /* =======================
      VIEW EDIT (PRO)
======================= */
if (view === "edit" && selectedMovie) {
  return (
    <Box pt={{ base: "120px", md: "80px" }}>
      {/* BACK */}
      <Button
        leftIcon={<MdArrowBack />}
        mb="20px"
        variant="ghost"
        onClick={() => setView("detail")}
      >
        Quay lại chi tiết
      </Button>

      <Card p="30px" maxW="1100px" mx="auto">
        <Text fontSize="2xl" fontWeight="800" mb="24px">
          ✏️ Chỉnh sửa phim
        </Text>

        <Grid templateColumns={{ base: "1fr", md: "1.3fr 1fr" }} gap="30px">
          {/* LEFT FORM */}
          <Box>
            <FormControl mb="16px">
              <FormLabel>Tên phim</FormLabel>
              <Input
                defaultValue={selectedMovie.title}
                fontWeight="600"
              />
            </FormControl>

            <FormControl mb="16px">
              <FormLabel>Thể loại</FormLabel>
              <Select defaultValue={selectedMovie.genre}>
                <option>Hành động</option>
                <option>Kinh dị</option>
                <option>Tình cảm</option>
                <option>Hoạt hình</option>
                <option>Khoa học viễn tưởng</option>
              </Select>
            </FormControl>

            <SimpleGrid columns={2} spacing="16px">
              <FormControl>
                <FormLabel>Thời lượng (phút)</FormLabel>
                <Input
                  type="number"
                  defaultValue={selectedMovie.duration}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Ngày khởi chiếu</FormLabel>
                <Input
                  type="date"
                  defaultValue="2026-01-20"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl mt="16px">
              <FormLabel>Trạng thái</FormLabel>
              <Select defaultValue={selectedMovie.status}>
                <option>Đang chiếu</option>
                <option>Sắp chiếu</option>
                <option>Ngừng chiếu</option>
              </Select>
            </FormControl>

            <FormControl mt="16px">
              <FormLabel>Mô tả phim</FormLabel>
              <Textarea
                rows={5}
                defaultValue={selectedMovie.description}
              />
            </FormControl>
          </Box>

          {/* RIGHT POSTER */}
          <Box>
            <Text fontWeight="700" mb="10px">
              Poster phim
            </Text>

            <Card p="14px">
              <img
                src={selectedMovie.poster}
                alt="poster"
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  marginBottom: "12px",
                }}
              />

              <Button
                width="100%"
                size="sm"
                colorScheme="blue"
                variant="outline"
              >
                Thay đổi poster
              </Button>
            </Card>

            <Card p="16px" mt="20px">
              <Text fontSize="sm" color={textGray}>
                Thông tin nhanh
              </Text>
              <Divider my="10px" />
              <Text fontSize="sm">
                🎬 Thể loại: <b>{selectedMovie.genre}</b>
              </Text>
              <Text fontSize="sm">
                ⏱ Thời lượng: <b>{selectedMovie.duration} phút</b>
              </Text>
              <Text fontSize="sm">
                📅 Khởi chiếu: <b>{selectedMovie.releaseDate}</b>
              </Text>
            </Card>
          </Box>
        </Grid>

        {/* ACTION */}
        <Divider my="24px" />

        <Flex justify="flex-end" gap="12px">
          <Button
            variant="outline"
            onClick={() => setView("detail")}
          >
            Hủy
          </Button>
          <Button
            colorScheme="brand"
            px="24px"
          >
            💾 Lưu thay đổi
          </Button>
        </Flex>
      </Card>
    </Box>
  );
}

  return null;
}
