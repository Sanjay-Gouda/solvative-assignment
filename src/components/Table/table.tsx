import { useEffect, useState } from "react";
import "./table.css";
import "../SearchBar/searchbar-style.css";
import axios from "axios";
import EmptyState from "../EmptyState/emptyState";
import Searchbar from "../SearchBar/searchbar";

type TtableData = {
  id: string;
  placeName: string;
  countryCode: string;
};

const Table = () => {
  const [tableData, setTableData] = useState<TtableData[]>([]);
  const [pageSize, setPageSize] = useState<number>(0);
  const [loader, setLoader] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("del");
  const [limit, setLimit] = useState<number>(3);

  /* API for fetching Cities */
  const getData = async () => {
    setLoader(true);
    const options = {
      method: "GET",
      url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
      params: { countryIds: "IN", namePrefix: searchText, limit: limit },
      headers: {
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        "x-rapidapi-key": "4f9147233dmsh135d7a21a17f37fp1782e0jsn94eaee12279a",
      },
    };

    try {
      const response = await axios.request(options);
      const dataOfcities = response.data.data;
      console.log(response?.data);
      const size = response?.data?.metadata?.totalCount;
      console.log(size);
      const pageLimit = size / limit;
      console.log(pageLimit);
      setLoader(false);
      setPageSize(Math.ceil(pageLimit));
      const newData = dataOfcities?.map((item: unknown) => ({
        placeName: item.city,
        countryCode: item.countryCode,
      }));
      setTableData(newData);
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  /*  onSearch change  */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  /* Call API If user Press Enter Button */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (limit > 11) {
        alert("Please enter limit below 11");
      } else if (limit <= 0) {
        alert("Please enter limit above 0");
      } else {
        getData();
      }
    }
  };

  /* Collect Limit From user  */
  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setLimit(parseInt(value));
  };

  return (
    <>
      <Searchbar onChange={handleChange} handleKeyDown={handleKeyDown} />

      <button onClick={() => getData()}>Call API</button>
      <div className="table-wrapper">
        {!tableData?.length ? (
          <EmptyState />
        ) : (
          <table>
            <tr className="theader">
              <th>#</th>
              <th>Place Name</th>
              <th>Country</th>
            </tr>

            {tableData?.map((city, ind) => (
              <tr key={city?.id}>
                <td>{ind + 1}</td>
                <td>{city?.placeName}</td>
                <td>
                  <img
                    src={`https://flagsapi.com/${city?.countryCode}/flat/24.png`}
                  />
                </td>
              </tr>
            ))}
          </table>
        )}

        {loader && <span className="loader"></span>}

        {tableData?.length !== 0 && (
          <div className="pagination-wrapper">
            <div className="pagination-btn-wrapper">
              {[...Array(pageSize)]?.map((_, i) => (
                <button className="default-button">{i + 1}</button>
              ))}
            </div>
            <input
              className="user-input"
              placeholder="Enter Limit and press Enter"
              onChange={handleLimitChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Table;
