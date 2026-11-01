export function createMockUser(overrides: Partial<any> = {}) {
  return {
    id: "usr_mock_123",
    email: "test@shiftslabs.com",
    name: "Test User",
    isEmailVerified: true,
    isPlatformAdmin: false,
    ...overrides,
  };
}

export function createMockBusiness(overrides: Partial<any> = {}) {
  return {
    id: "biz_mock_456",
    ownerId: "usr_mock_123",
    name: "Apex Fashion Design",
    slug: "apex-fashion",
    defaultApp: "craftkoru",
    professionId: "tailor",
    currency: "USD",
    timezone: "UTC",
    ...overrides,
  };
}
