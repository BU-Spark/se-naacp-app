import React from "react";
import "./DateBar.css";

import TextField from "@mui/material/TextField";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { ArticleContext } from "../../../contexts/article_context";
import { TractContext } from "../../../contexts/tract_context";
import { NeighborhoodContext } from "../../../contexts/neighborhood_context";

interface DateFieldProps {
  title: string;
  minDate: Dayjs;
  maxDate: Dayjs;
  isFrom: boolean;
}

const DateField: React.FC<DateFieldProps> = ({ minDate, maxDate, isFrom }) => {
  const [dateFrom, setdateFrom] = React.useState(minDate);
  const [dateTo, setDateTo] = React.useState(maxDate);

  const { articleData, queryArticleDataType } =
    React.useContext(ArticleContext)!;
  const { tractData, queryTractDataType } = React.useContext(TractContext)!;
  const { neighborhood } = React.useContext(NeighborhoodContext)!;

  const handleChangeFrom = (d: any) => {
    queryArticleDataType("ARTICLE_DATA", {
      dateFrom: dateFrom,
      dateTo: dateTo,
      area: tractData?.tract,
      userId: "1"
    });
    setdateFrom(d);
  };

  const handleChangeTo = (d: any) => {
    setDateTo(d);
  };

  React.useEffect(() => {
    queryArticleDataType("ARTICLE_DATA", {
      dateFrom: parseInt(dateFrom.format("YYYYMMDD")),
      dateTo: parseInt(dateTo.format("YYYYMMDD")),
      area: tractData?.tract,
      userId: "1"

    });
  }, [dateFrom, dateTo, tractData, neighborhood]);

  return (
    <>
      <div style={{ display: "flex" }}>
        <div>
          <p className="word1">Start Date</p>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              inputFormat="MM/DD/YYYY"
              value={dateFrom}
              onChange={handleChangeFrom}
              minDate={minDate}
              maxDate={maxDate}
              renderInput={(params) => (
                <TextField
                  sx={{
                    width: "97%",
                    "& .MuiInputBase-root": {
                      borderRadius: 0.5,
                      height: 34,
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderWidth: 2,
                        borderColor: "#ccc",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ccc",
                      },
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "#ccc",
                    },
                  }}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>
        </div>

        <div>
          <p className="word1">End Date</p>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              inputFormat="MM/DD/YYYY"
              value={dateTo}
              onChange={handleChangeTo}
              minDate={minDate}
              maxDate={maxDate}
              renderInput={(params) => (
                <TextField
                  sx={{
                    width: "97%",
                    "& .MuiInputBase-root": {
                      borderRadius: 0.5,
                      height: 34,
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderWidth: 2,
                        borderColor: "#ccc",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ccc",
                      },
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "#ccc",
                    },
                  }}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>
        </div>
      </div>
    </>
  );
};

export default DateField;
