import React from "react";
import {
  Box,
  Grid,
  Text,
  SimpleGrid,
  Flex,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  MdAttachMoney,
  MdConfirmationNumber,
  MdAccessTime,
  MdEventSeat,
} from "react-icons/md";
import Card from "components/card/Card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ===================== DATA ===================== */

const revenueData = [
  { day: "Mon", revenue: 1200000 },
  { day: "Tue", revenue: 1800000 },
  { day: "Wed", revenue: 1500000 },
  { day: "Thu", revenue: 2200000 },
  { day: "Fri", revenue: 3000000 },
  { day: "Sat", revenue: 4200000 },
  { day: "Sun", revenue: 3800000 },
];

const ticketByMovie = [
  { name: "Avengers", tickets: 320 },
  { name: "Spider-Man", tickets: 260 },
  { name: "Batman", tickets: 180 },
];

const ticketStatus = [
  { name: "Đã bán", value: 720 },
  { name: "Đã hủy", value: 80 },
];

const COLORS = ["#3182CE", "#E53E3E"];

const totalTickets = ticketStatus.reduce(
  (sum, item) => sum + item.value,
  0
);

const renderLabel = ({ percent }) =>
  `${(percent * 100).toFixed(1)}%`;

/* ===================== COMPONENT ===================== */

export default function Thongke() {
  const textColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <Box pt={{ base: "120px", md: "80px" }}>
      {/* HEADER */}
      <Box mb="30px">
        <Text fontSize="3xl" fontWeight="700" color={textColor}>
          Thống kê hệ thống
        </Text>
        <Text color="gray.500">
          Tổng quan doanh thu, vé và suất chiếu
        </Text>
      </Box>

      {/* KPI */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing="20px" mb="30px">
        <Card>
          <Flex align="center">
            <Icon as={MdAttachMoney} boxSize="28px" color="green.400" mr="12px" />
            <Box>
              <Text fontSize="sm" color="gray.500">Doanh thu</Text>
              <Text fontSize="2xl" fontWeight="700">12.500.000 ₫</Text>
            </Box>
          </Flex>
        </Card>

        <Card>
          <Flex align="center">
            <Icon as={MdConfirmationNumber} boxSize="28px" color="blue.400" mr="12px" />
            <Box>
              <Text fontSize="sm" color="gray.500">Vé đã bán</Text>
              <Text fontSize="2xl" fontWeight="700">800</Text>
            </Box>
          </Flex>
        </Card>

        <Card>
          <Flex align="center">
            <Icon as={MdAccessTime} boxSize="28px" color="orange.400" mr="12px" />
            <Box>
              <Text fontSize="sm" color="gray.500">Suất chiếu hôm nay</Text>
              <Text fontSize="2xl" fontWeight="700">18</Text>
            </Box>
          </Flex>
        </Card>

        <Card>
          <Flex align="center">
            <Icon as={MdEventSeat} boxSize="28px" color="purple.400" mr="12px" />
            <Box>
              <Text fontSize="sm" color="gray.500">Tỉ lệ lấp ghế</Text>
              <Text fontSize="2xl" fontWeight="700">76%</Text>
            </Box>
          </Flex>
        </Card>
      </SimpleGrid>

      {/* LINE + PIE */}
      <Grid templateColumns={{ base: "1fr", xl: "2fr 1fr" }} gap="24px">
        
        {/* LINE CHART */}
        <Card p="20px">
          <Text fontSize="lg" fontWeight="700" mb="12px">
            Doanh thu theo ngày
          </Text>
          <Box h="320px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3182CE"
                  strokeWidth={4}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* PIE CHART */}
        <Card p="20px">
          <Text fontSize="lg" fontWeight="700" mb="12px">
            Trạng thái vé
          </Text>

          <Flex align="center">
            <Box h="260px" flex="1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketStatus}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={6}
                    label={renderLabel}
                    labelLine={false}
                  >
                    {ticketStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>

                  {/* CENTER TEXT */}
                  <text
                    x="50%"
                    y="45%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="18"
                    fontWeight="700"
                    fill="#2D3748"
                  >
                    {totalTickets}
                  </text>
                  <text
                    x="50%"
                    y="55%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="12"
                    fill="#718096"
                  >
                    Tổng vé
                  </text>

                  <Tooltip
                    formatter={(value) => [
                      `${value} vé (${((value / totalTickets) * 100).toFixed(1)}%)`,
                      "Số lượng",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* LEGEND */}
            <Box ml="20px">
              {ticketStatus.map((item, i) => (
                <Flex key={i} align="center" mb="10px">
                  <Box
                    w="10px"
                    h="10px"
                    bg={COLORS[i]}
                    borderRadius="full"
                    mr="8px"
                  />
                  <Box>
                    <Text fontSize="sm" fontWeight="600">
                      {item.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {item.value} vé (
                      {((item.value / totalTickets) * 100).toFixed(1)}%)
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Box>
          </Flex>
        </Card>
      </Grid>

      {/* BAR CHART */}
      <Box mt="24px">
        <Card p="20px">
          <Text fontSize="lg" fontWeight="700" mb="12px">
            Vé bán theo phim
          </Text>
          <Box h="320px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketByMovie} barSize={42}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="tickets" fill="#805AD5" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
