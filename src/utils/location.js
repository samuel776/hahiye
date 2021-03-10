import reqIP from "request-ip";
import geoipCountry from "geoip-country";

class LocationUtils {
  findLocation(req) {
    const ip = reqIP.getClientIp(req);
    const test = geoipCountry.lookup(ip);

    const country = test ? test.country : "";

    return country;
  }
}

export default LocationUtils;
