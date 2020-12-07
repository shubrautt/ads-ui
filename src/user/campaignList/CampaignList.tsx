import React, { useContext, useEffect, useState, useRef } from "react";

import * as _ from "lodash";

import Section from "../../components/section/Section";

import { CAMPAIGN_LIST } from "./lib/CampaignList.queries";
import { useQuery } from "@apollo/react-hooks";

import Table from "../../components/Table/TableComponent";
import { Link } from "react-router-dom";

import * as S from "./style/CampaignList.style";



const CampaignList = props => {


    const { match } = props;

    const userId = props.userId;
    const advertiserId = props.advertiserId;

    const { loading, error, data } = useQuery(CAMPAIGN_LIST, {
        variables: { id: props.advertiserId }
    });

    const columns = [
        {
            Header: 'Campaign',
            accessor: 'name',
            Cell: (props) => {
                return (
                    <div>
                        <Link style={{ textDecoration: "none", color: "rgb(251, 84, 43)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} to={`campaign/${props.row.original.id}/analytics/overview`}>
                            <div style={{ textDecoration: "none", color: "rgb(251, 84, 43)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={props.row.original.name}>{props.row.original.name}</div>
                        </Link>

                        <Link style={{ textDecoration: "none", color: "rgb(251, 84, 43)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: '8px', fontSize: "10px" }} to={`/user/main/adsmanager/advanced?userId=${userId}&advertiserId=${advertiserId}&campaignId=${props.row.original.id}`}>
                            <div style={{ textDecoration: "none", color: "rgb(251, 84, 43)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={props.row.original.name}>Edit</div>
                        </Link>
                    </div>
                )
            }
        },
        {
            Header: 'Status',
            accessor: 'state',
            Cell: (props) => {
                return props.row.original.state === "active" ? <div title="Active"><S.ActiveSymbol /></div> : <div title={props.row.original.state}><S.PendingSymbol /></div>
            }
        },
        {
            Header: 'Budget',
            accessor: 'budget',
            sortDescFirst: true,
            Cell: (props) => {
                return props.row.original.currency === "USD" ? `$${props.row.original.budget.toFixed(2)}` : `${props.row.original.budget.toFixed(2)} BAT`
            },
        },
        {
            Header: 'Daily Budget',
            accessor: 'dailyBudget',
            sortDescFirst: true,
            Cell: (props) => {
                return props.row.original.currency === "USD" ? `$${props.row.original.dailyBudget.toFixed(2)}` : `${props.row.original.dailyBudget.toFixed(2)} BAT`
            },
        },
        {
            Header: 'Spend',
            accessor: 'spent',
            sortDescFirst: true,
            Cell: (props) => {
                return props.row.original.currency === "USD" ? `$${props.row.original.spent.toFixed(2)}` : `${props.row.original.spent.toFixed(2)} BAT`
            },
        },
        {
            Header: 'Start Date',
            accessor: 'startAt',
            sortDescFirst: true,
            Cell: (props) => {
                return new Date(props.row.original.startAt).toLocaleDateString("en-US")
            },
        },
        {
            Header: 'End Date',
            accessor: 'endAt',
            sortDescFirst: true,
            Cell: (props) => {
                return new Date(props.row.original.endAt).toLocaleDateString("en-US")
            },
        }
    ];


    if (loading) return <></>;

    return (
        <div>
            <Section fullWidthChild={true}>
                <Table data={data.advertiser.campaigns} columns={columns} tableWidth={1094} columnCount={7} />
            </Section>
        </div>
    );
}


export default CampaignList;

