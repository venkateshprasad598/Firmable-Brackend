import { parseStringPromise } from "xml2js";
import dayjs from "dayjs";
import { convertToUnix, toTitleCase } from "./services";

export const parseABNXml = async (xmlData: string) => {
  const json = await parseStringPromise(xmlData, { explicitArray: false });

  const abrList = json?.Transfer?.ABR || [];

  const records = Array.isArray(abrList) ? abrList : [abrList];

  return records.map((item: any) => {
    const legal = item.LegalEntity?.IndividualName || {};
    const main = item.MainEntity?.NonIndividualName || {};
    const other = item.OtherEntity?.NonIndividualName || {};

    const getName = () =>
      legal?.FamilyName ||
      legal?.GivenName ||
      main?.NonIndividualNameText ||
      other?.NonIndividualNameText;

    return {
      abn: item.ABN?.["_"] || item.ABN?.["__text"] || item.ABN,
      status: item.ABN?.["$"]?.status || item.ABN?.["@_status"],
      statusFromDate: convertToUnix(
        item.ABN?.["$"]?.ABNStatusFromDate || item.ABN?.["@_ABNStatusFromDate"]
      ),
      entityType: {
        ind: item.EntityType?.EntityTypeInd,
        text: item.EntityType?.EntityTypeText,
      },
      name: toTitleCase(getName()),
      // nameType: legal?.['$']?.type || main?.['$']?.type || other?.['$']?.type || '',
      state:
        item?.LegalEntity?.BusinessAddress?.AddressDetails?.State ||
        item?.MainEntity?.BusinessAddress?.AddressDetails?.State ||
        "",
      postcode:
        item?.LegalEntity?.BusinessAddress?.AddressDetails?.Postcode ||
        item?.MainEntity?.BusinessAddress?.AddressDetails?.Postcode ||
        "",
      gstStatus: item?.GST?.["$"]?.status,
      // gstFromDate: item?.GST?.['$']?.GSTStatusFromDate,
      recordLastUpdatedDate: convertToUnix(item?.["$"]?.recordLastUpdatedDate),
      // replaced: item?.['$']?.replaced
    };
  });
};
