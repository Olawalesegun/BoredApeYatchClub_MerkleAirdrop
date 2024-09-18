import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AirdropTokModule = buildModule("AirdropTokenModule", (m) => {
  const airdropTok = m.contract("AirdropToken");
  return { airdropTok };
});
export default AirdropTokModule;