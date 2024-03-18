import { useEffect, useState } from "react";
import "./table.css";
import "../SearchBar/searchbar-style.css";
import axios from "axios";
import { data } from "../../constants/cityAPI";
import EmptyState from "../EmptyState/emptyState";
import Searchbar from "../SearchBar/searchbar";

const Table = () => {
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const getData = async () => {
    const options = {
      method: "GET",
      url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
      params: { countryIds: "IN", namePrefix: "del", limit: "5" },
      headers: {
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        // "x-rapidapi-key": "8a884ed896msh3c3802cc2c43ed8p188542jsn714dd772dc0d", // get key from https://rapidapi.com/wirefreethought/api/geodb-cities/
        "x-rapidapi-key": "4f9147233dmsh135d7a21a17f37fp1782e0jsn94eaee12279a", // get key from https://rapidapi.com/wirefreethought/api/geodb-cities/
      },
    };

    try {
      const response = await axios.request(options);
      const dataOfcities = response.data.data;
      console.log(response.data);
      const newData = dataOfcities?.map((item) => ({
        placeName: item.city,
        countryCode: item.countryCode,
      }));
      setTableData(newData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(tableData);
  }, [tableData]);

  const handleChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getData();
    }
  };

  return (
    <>
      <Searchbar onChange={handleChange} handleKeyDown={handleKeyDown} />

      <button onClick={() => getData()}>Call API</button>
      <div style={{ overflowX: "auto", width: "500px" }}>
        <table>
          <tr className="theader">
            <th>#</th>
            <th>Place Name</th>
            <th>Country</th>
          </tr>

          {tableData?.slice(0, 3).map((city, ind) => (
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

        <div>
          {tableData?.map((_, i) => (
            <button className="default-button">{i + 1}</button>
          ))}
          <input className="user-input" />
        </div>

        <div></div>

        <EmptyState />
      </div>
    </>
  );
};

export default Table;
